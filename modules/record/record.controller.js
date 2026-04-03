import Record from "./record.model.js";

export const createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, note } = req.body;

    // basic validation
    if (!amount || !type || !category) {
      return res.status(400).json({
        success: false,
        message: "Amount, type and category are required",
      });
    }

    const record = await Record.create({
      amount,
      type,
      category,
      date,
      note,
      createdBy: req.user._id, 
    });

    return res.status(201).json({
      success: true,
      message: "Record created successfully",
      data: record,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




export const getRecords = async (req, res) => {
  try {
    const {
      type,
      category,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    // base query
    let query = {
      createdBy: req.user._id,
      isDeleted: false,
    };

    if (type) {
      query.type = type;
    }

    if (category) {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};

      if (startDate) {
        query.date.$gte = new Date(startDate);
      }

      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    // pagination
    const skip = (page - 1) * limit;

    const records = await Record.find(query)
      .sort({ date: -1 }) // latest first
      .skip(skip)
      .limit(Number(limit));

    const total = await Record.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: records,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, type, category, date, note } = req.body;

    // find record
    const record = await Record.findOne({
      _id: id,
      createdBy: req.user._id,
      isDeleted: false,
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    // update fields (only if provided)
    if (amount !== undefined) record.amount = amount;
    if (type) record.type = type;
    if (category) record.category = category;
    if (date) record.date = date;
    if (note !== undefined) record.note = note;

    await record.save();

    return res.status(200).json({
      success: true,
      message: "Record updated successfully",
      data: record,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const softDeleteRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await Record.findOneAndUpdate(
      {
        _id: id,
        createdBy: req.user._id,
        isDeleted: false,
      },
      {
        isDeleted: true,
      },
      { new: true }
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found or already deleted",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Record deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};