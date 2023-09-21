import { BaseService } from "@/_core/service/BaseService";
import { ComplaintCategory } from "@/modules/Complaint/models/ComplaintCategory";
import { ComplaintModel } from "@/modules/Complaint/models/ComplaintModel";

export default class ComplaintService extends BaseService {
  getComplaintList(offset = 0, limit = 25) {
    const mockData = this.tempCreateMockList();
    return { complaints: mockData.slice(offset, limit + offset), totalCount: mockData.length };
  }

  getComplaintById(id: number | string) {
    return new ComplaintModel({
      id: id,
      date: "2022-03-10 00:37:12",
      email: "Test",
      material: "Материал",
      user: "12",
      category: new ComplaintCategory({
        id: 1,
        name: "Порно",
      }),
    });
  }

  tempCreateMockList() {
    return [...new Array(60)].map(
      (iter, idx) =>
        new ComplaintModel({
          id: idx,
          date: "2022-03-10 00:37:12",
          email: "Test",
          material: "Материал",
          user: "12",
          category: new ComplaintCategory({
            id: 1,
            name: "Порно",
          }),
        })
    );
  }
}
