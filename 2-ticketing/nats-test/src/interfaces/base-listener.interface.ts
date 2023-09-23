import { Subjects } from "../enums";

export interface IBaseEvent {
  subject: Subjects;
  data: any;
}
