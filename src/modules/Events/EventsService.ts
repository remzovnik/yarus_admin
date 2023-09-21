import { BaseService } from "@/_core/service/BaseService";
import { EventCategory, EventModel } from "@/modules/Events/models/EventModel";

export default class EventsService extends BaseService {
  async getEventData(status: EventCategory, query = "", offset = 0, limit = 15) {
    const axiosConfig = {
      params: {
        limit,
        offset,
        query,
        status,
      },
    };
    const result = await this.apiRequest.get("event/v2/event/admin/search", axiosConfig);
    return result?.data;
  }
  async changeStatus(id, status) {
    return this.apiRequest.patch(`event/v2/event/${id}/status`, { status: status });
  }

  async deleteEvent(id: number) {
    try {
      await this.apiRequest.delete(`event/v2/event/${id}`);
      return true;
    } catch {
      return false;
    }
  }
}
