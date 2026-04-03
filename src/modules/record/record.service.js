import { createError } from "../../utils/api-response.js";
import * as recordModel from "./record.model.js";

const createRecord = async (payload, currentUser) => {
  return recordModel.createRecord({
    userId: currentUser.id,
    amount: payload.amount,
    type: payload.type,
    category: payload.category,
    date: payload.date,
    notes: payload.notes || null
  });
};

const getRecords = async (filters) => {
  const result = await recordModel.listRecords(filters);
  const totalPages = result.total === 0 ? 0 : Math.ceil(result.total / filters.limit);

  return {
    items: result.items,
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total: result.total,
      totalPages
    }
  };
};

const updateRecord = async (recordId, payload) => {
  const existingRecord = await recordModel.findRecordById(recordId);

  if (!existingRecord) {
    throw createError(404, "Record not found");
  }

  return recordModel.updateRecord(recordId, {
    amount: payload.amount !== undefined ? payload.amount : existingRecord.amount,
    type: payload.type || existingRecord.type,
    category: payload.category || existingRecord.category,
    date: payload.date || existingRecord.date,
    notes: payload.notes !== undefined ? payload.notes : existingRecord.notes
  });
};

const deleteRecord = async (recordId) => {
  const deletedRecord = await recordModel.deleteRecord(recordId);

  if (!deletedRecord) {
    throw createError(404, "Record not found");
  }

  return deletedRecord;
};

export { createRecord, getRecords, updateRecord, deleteRecord };
