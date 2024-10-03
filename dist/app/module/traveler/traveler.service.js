"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.travelerServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const traveler_constant_1 = require("./traveler.constant");
const traveler_model_1 = __importDefault(require("./traveler.model")); // Import Traveler model
const getAllTravelers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const travelerQuery = new QueryBuilder_1.default(traveler_model_1.default.find(), Object.assign(Object.assign({}, query), { sort: `${query.sort}` }))
        .searchQuery(traveler_constant_1.travelerSearchableFields)
        .filterQuery()
        .sortQuery()
        .paginateQuery()
        .fieldFilteringQuery()
        .populateQuery([{ path: 'user', select: '-createdAt -updatedAt -__v' }]);
    const result = yield (travelerQuery === null || travelerQuery === void 0 ? void 0 : travelerQuery.queryModel);
    const total = yield traveler_model_1.default.countDocuments(travelerQuery.queryModel.getFilter());
    return { data: result, total };
});
const getTravelerById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const traveler = yield traveler_model_1.default.findById(id)
        .select('-__v')
        .populate('user', '-createdAt -updatedAt -__v');
    return traveler;
});
// const updateTravelerById = async (id: string, payload: Partial<TTraveler>) => {
//   const { name, guardian, ...restTravelerData } = payload
//   const modifiedUpdatedData: Record<string, unknown> = {
//     ...restTravelerData,
//   }
//   // update non-primitive values
//   // Update name
//   if (name && Object.keys(name)?.length > 0) {
//     for (const [key, value] of Object.entries(name)) {
//       modifiedUpdatedData[`name.${key}`] = value
//     }
//   }
//   // update guardian
//   if (guardian && Object.keys(guardian)?.length > 0) {
//     for (const [key, value] of Object.entries(guardian)) {
//       modifiedUpdatedData[`guardian.${key}`] = value
//     }
//   }
//   const traveler = await Traveler.findByIdAndUpdate(id, modifiedUpdatedData, {
//     new: true,
//   })
//     .select('-__v')
//     .populate('user', '-createdAt -updatedAt -__v -department')
//     .populate('academicInfo.department')
//     .populate('academicInfo.batch')
//   return traveler
// }
const deleteTravelerById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const traveler = yield traveler_model_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).select('-__v');
    return traveler;
});
exports.travelerServices = {
    // Change export name to travelerServices
    getAllTravelers, // Change to getAllTravelers
    getTravelerById, // Change to getTravelerById
    // updateTravelerById, // Change to updateTravelerById
    deleteTravelerById, // Change to deleteTravelerById
};
