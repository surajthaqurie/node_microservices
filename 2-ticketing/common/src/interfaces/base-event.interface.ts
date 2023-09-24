import { Subjects } from "../enums";

export interface IBaseListenerEvent {
  subject: Subjects;
  data: any;
}

export interface IBasePublisherEvent {
  subject: Subjects;
  data: any;
}
