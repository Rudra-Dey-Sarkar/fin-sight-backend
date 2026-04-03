import asyncHandler from "../../utils/async-handler.js";
import { sendSuccess } from "../../utils/api-response.js";
import * as recordService from "./record.service.js";
import {
  createRecordSchema,
  updateRecordSchema,
  listRecordsQuerySchema,
  recordIdParamSchema
} from "./record.validation.js";

const createRecord = asyncHandler(async (req, res) => {
  const payload = createRecordSchema.parse(req.body);
  const data = await recordService.createRecord(payload, req.user);

  return sendSuccess(res, 201, "Record created successfully", data);
});

const getRecords = asyncHandler(async (req, res) => {
  const filters = listRecordsQuerySchema.parse(req.query);
  const data = await recordService.getRecords(filters);

  return sendSuccess(res, 200, "Records fetched successfully", data);
});

const updateRecord = asyncHandler(async (req, res) => {
  const params = recordIdParamSchema.parse(req.params);
  const payload = updateRecordSchema.parse(req.body);
  const data = await recordService.updateRecord(params.id, payload);

  return sendSuccess(res, 200, "Record updated successfully", data);
});

const deleteRecord = asyncHandler(async (req, res) => {
  const params = recordIdParamSchema.parse(req.params);
  const data = await recordService.deleteRecord(params.id);

  return sendSuccess(res, 200, "Record deleted successfully", data);
});

export { createRecord, getRecords, updateRecord, deleteRecord };
