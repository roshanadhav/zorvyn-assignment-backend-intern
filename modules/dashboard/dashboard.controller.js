import Record from "../record/record.model.js";

export const getSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Record.aggregate([
      {
        $match: {
          createdBy: userId,
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    result.forEach((item) => {
      if (item._id === "income") totalIncome = item.total;
      if (item._id === "expense") totalExpense = item.total;
    });

    return res.status(200).json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        netBalance: totalIncome - totalExpense,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getCategoryWise = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Record.aggregate([
      {
        $match: {
          createdBy: userId,
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    // convert array → object
    const data = {};
    result.forEach((item) => {
      data[item._id] = item.total;
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMonthlyTrends = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Record.aggregate([
      {
        $match: {
          createdBy: userId,
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
    ]);

    // restructure data
    const map = {};

    result.forEach((item) => {
      const key = `${item._id.year}-${item._id.month}`;

      if (!map[key]) {
        map[key] = {
          month: key,
          income: 0,
          expense: 0,
        };
      }

      if (item._id.type === "income") {
        map[key].income = item.total;
      } else {
        map[key].expense = item.total;
      }
    });

    const finalData = Object.values(map);

    return res.status(200).json({
      success: true,
      data: finalData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getRecentActivity = async (req, res) => {
  try {
    const userId = req.user._id;

    const records = await Record.find({
      createdBy: userId,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      data: records,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

