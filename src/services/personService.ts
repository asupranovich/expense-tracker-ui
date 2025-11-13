import {apiClient} from "./apiClient";
import {PersonForm, Person} from "@/types";

export const personService = {
  async getAll(): Promise<Person[]> {
    return await apiClient.get('person');
  },

  async updatePerson(person: PersonForm) {
    return await apiClient.put(`person/${person.id}`, person);
  },

  async addPerson(person: PersonForm) {
    return await apiClient.post('person', person);
  },
};