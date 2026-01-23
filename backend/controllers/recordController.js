const Record = require('../models/Record');

/**
 * @desc    Get all records for logged in user
 * @route   GET /api/records
 * @access  Private
 */
const getRecords = async (req, res, next) => {
  try {
    const records = await Record.find().sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single record
 * @route   GET /api/records/:id
 * @access  Private
 */
const getRecord = async (req, res, next) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Record not found',
      });
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new record
 * @route   POST /api/records
 * @access  Private
 */
const createRecord = async (req, res, next) => {
  try {
    const record = await Record.create(req.body);

    res.status(201).json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update record
 * @route   PUT /api/records/:id
 * @access  Private
 */
const updateRecord = async (req, res, next) => {
  try {
    let record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Record not found',
      });
    }

    record = await Record.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete record
 * @route   DELETE /api/records/:id
 * @access  Private
 */
const deleteRecord = async (req, res, next) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Record not found',
      });
    }

    await record.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
};
