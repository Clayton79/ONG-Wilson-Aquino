import { eventRepository } from '../repositories';
import { OngEvent, PaginationParams } from '../models';
import { EventInput } from '../models/schemas';
import { paginate } from '../utils';

export class EventService {
  async getAll(params: PaginationParams) {
    const items = await eventRepository.findAll();
    return paginate<OngEvent>(items, params);
  }

  async getById(id: string): Promise<OngEvent> {
    const event = await eventRepository.findById(id);
    if (!event) {
      throw new Error('Evento não encontrado');
    }
    return event;
  }

  async getUpcoming(): Promise<OngEvent[]> {
    return eventRepository.findUpcoming();
  }

  async create(data: EventInput): Promise<OngEvent> {
    return eventRepository.create(data);
  }

  async update(id: string, data: Partial<EventInput>): Promise<OngEvent> {
    const existing = await eventRepository.findById(id);
    if (!existing) {
      throw new Error('Evento não encontrado');
    }

    const updated = await eventRepository.update(id, data);
    if (!updated) {
      throw new Error('Erro ao atualizar evento');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const success = await eventRepository.delete(id);
    if (!success) {
      throw new Error('Evento não encontrado');
    }
  }

  async addParticipant(eventId: string, volunteerId: string): Promise<OngEvent> {
    const event = await eventRepository.addParticipant(eventId, volunteerId);
    if (!event) {
      throw new Error('Evento não encontrado');
    }
    return event;
  }

  async removeParticipant(eventId: string, volunteerId: string): Promise<OngEvent> {
    const event = await eventRepository.removeParticipant(eventId, volunteerId);
    if (!event) {
      throw new Error('Evento não encontrado');
    }
    return event;
  }

  async count(): Promise<number> {
    return eventRepository.count();
  }

  async countUpcoming(): Promise<number> {
    return eventRepository.countUpcoming();
  }
}

export const eventService = new EventService();
