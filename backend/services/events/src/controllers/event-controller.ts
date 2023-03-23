import { isValidObjectId } from 'mongoose';
import { ErrorResponse } from '../utils/error-response';
import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { Event } from "../models/event-model";
import asyncHandler from 'express-async-handler';

export const fetchAllEvents = asyncHandler(async (request: any, response: any, next: NextFunction): Promise<any> => {
    const keyword = request.query.keyword;
    const events = await Event.find();

    if(!events) {
      return next(new ErrorResponse(`No events found. Please try again`, StatusCodes.BAD_REQUEST));
    }

    return response.status(StatusCodes.OK).json({success: true, events});
})

export const fetchSingleEvent = async (request: any, response: any, next: NextFunction): Promise<any> => {

        const id = request.params.id;
        const event = await Event.findById(id)

        if(!event) {
           return next(new ErrorResponse(`No event with that ID : ${id} found on the server-side. Please try again later`, StatusCodes.BAD_REQUEST));
        }

        return response.status(StatusCodes.OK).json({success: true, event});

    }

export const createNewEvent = async (request: any, response: any, next: NextFunction): Promise<any> => {
        const {name, summary, description, startAt, endsAt, eventStatus, format, isOnline, capacity, hasSeating, slotsAvailable, reservedSeating, salesStatus, venue, organiser, ticket, category } = request.body;

        if(!name || !summary || !description || !startAt || !endsAt || !eventStatus || !format || !isOnline || !capacity || !hasSeating || !slotsAvailable || !reservedSeating || !salesStatus || !venue || !organiser || !ticket || !category) {
            return next(new ErrorResponse(`One of the event fields are missing. Please try again`, StatusCodes.BAD_REQUEST));
        }

        const event = await Event.create({name, summary, description, startAt, endsAt, eventStatus, format, isOnline, capacity, hasSeating, slotsAvailable, reservedSeating, salesStatus, venue, organiser, ticket, category});
        await event.save();

        return response.status(StatusCodes.CREATED).json({success: true, event});

}    

export const editEventByID = async (request: any, response: any, next: NextFunction): Promise<any> => {

        const id = request.params.id;
        let event = await Event.findById(id);

        if(!isValidObjectId(id)) {
            return next(new ErrorResponse(`Event ID is invalid. Please check again`, StatusCodes.BAD_REQUEST));
        }

        // Check if the event status is not started already or canceled
        if(event.eventStatus === 'started') {
            return next(new ErrorResponse(`You cannot modify the event ${id} - as it has already started`, StatusCodes.BAD_REQUEST));
        }

        // Check to see if the event has canceled
        if(event.eventStatus === 'canceled') {
            return next(new ErrorResponse(`You cannot modify the event ${id} - as it has already been canceled`, StatusCodes.BAD_REQUEST));
        }

        if(!event) {
            return next(new ErrorResponse(`No event with that ID : ${id} found on the server-side. Please try again later`, StatusCodes.BAD_REQUEST));
        }

        event = await Event.findByIdAndUpdate(id, request.body, {new: true, runValidators: true});
        return response.status(StatusCodes.OK).json({success: true, event});
    }
    

export const deleteEvents = asyncHandler(async (request: any, response: any, next: NextFunction): Promise<any> => {
    await Event.deleteMany();
    return response.status(StatusCodes.NO_CONTENT).json({success: true, message: "Events Deleted"})
})

export const deleteEventByID = asyncHandler(async (request: any, response: any, next: NextFunction): Promise<any> => {
     const id = request.params.id;
     let event = await Event.findById(id);

     if(!event) {
        return next(new ErrorResponse(`Could not find that event ID`, StatusCodes.BAD_REQUEST));
     }

     event = await Event.findByIdAndUpdate(id, request.body, {new: true, runValidators: true});
     await event.save();
     return response.status(StatusCodes.OK).json({success: true, message: `Event with ID : ${id} - updated successfully`});
})

export const uploadEventPhoto = asyncHandler(async (request: any, response: any, next: NextFunction): Promise<any> => {
  const file = request.file.files;

  
})

export const editEventStartTime = asyncHandler(async (request: any, response: any, next: NextFunction): Promise<any> => {
  const fieldsToUpdate = {newStartsAt: request.body.startsAt, newEndsAt: request.body.newEndsAt};
  const id = request.params.id; // Take the event ID to update
  let event = await Event.findById(id);
  
  if(!isValidObjectId(id)) {
     return next(new ErrorResponse(`Event ID is not valid`, StatusCodes.BAD_REQUEST));
  }

  if(!event) {
     return next(new ErrorResponse(`No event found with that ID`, StatusCodes.BAD_REQUEST));
  }

  event = await Event.findByIdAndUpdate(id, fieldsToUpdate, {new: true, runValidators: true})
  await event.save();

  event.startAt = request.body.startsAt;
  event.endsAt = request.body.endsAt;

  return response.status(StatusCodes.OK).json({success: true, message: "Event Start / End Dates Modified", event});
})