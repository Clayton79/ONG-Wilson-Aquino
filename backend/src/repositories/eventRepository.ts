import { v4 as uuidv4 } from 'uuid';
import { OngEvent } from '../models';
import { readCollection, writeCollection, findById, insertOne, updateOne, deleteOne } from '../utils';

const COLLECTION = 'events';

export class EventRepository {
  async findAll(): Promise<OngEvent[]> {
    return readCollection<OngEvent>(COLLECTION);
  }

  async findById(id: string): Promise<OngEvent | undefined> {
    return findById<OngEvent>(COLLECTION, id);
  }

  async findUpcoming(): Promise<OngEvent[]> {
    const items = await readCollection<OngEvent>(COLLECTION);
    const now = new Date().toISOString();
    return items
      .filter((e) => e.date >= now && e.status !== 'cancelled')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async create(data: Omit<OngEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<OngEvent> {
    const event: OngEvent = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return insertOne<OngEvent>(COLLECTION, event);
  }

  async update(id: string, data: Partial<OngEvent>): Promise<OngEvent | null> {
    return updateOne<OngEvent>(COLLECTION, id, data);
  }

  async delete(id: string): Promise<boolean> {
    return deleteOne<OngEvent>(COLLECTION, id);
  }

  async count(): Promise<number> {
    const items = await readCollection<OngEvent>(COLLECTION);
    return items.length;
  }

  async countUpcoming(): Promise<number> {
    const upcoming = await this.findUpcoming();
    return upcoming.length;
  }

  async addParticipant(eventId: string, volunteerId: string): Promise<OngEvent | null> {
    const event = await this.findById(eventId);
    if (!event) return null;
    if (event.participantIds.includes(volunteerId)) return event;
    return this.update(eventId, {
      participantIds: [...event.participantIds, volunteerId],
    });
  }

  async removeParticipant(eventId: string, volunteerId: string): Promise<OngEvent | null> {
    const event = await this.findById(eventId);
    if (!event) return null;
    return this.update(eventId, {
      participantIds: event.participantIds.filter((id) => id !== volunteerId),
    });
  }

  async resetCollection(data: OngEvent[]): Promise<void> {
    await writeCollection(COLLECTION, data);
  }
}

export const eventRepository = new EventRepository();
