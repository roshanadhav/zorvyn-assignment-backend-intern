export const validate = (schema) => (req, res, next) => {
  try {
    // parse will throw error if invalid
    schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.errors.map((e) => e.message),
    });
  }
};