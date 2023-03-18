import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import NoteModel from "../models/NoteModels";

type ReqBodyType = {
  title?: string;
  text?: string;
};

export const getNotes: RequestHandler = async (req, res, next) => {
  try {
    const notes = await NoteModel.find().exec();

    if (!notes) {
      throw createHttpError(404, "Note not found");
    }

    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const getNote: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.isValidObjectId(id)) {
      throw createHttpError(400, "Invalid note id");
    }

    const note = await NoteModel.findById(id).exec();

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const createNote: RequestHandler<
  unknown,
  unknown,
  ReqBodyType,
  unknown
> = async (req, res, next) => {
  const { title, text } = req.body;

  try {
    if (!title) {
      throw createHttpError(400, "Note must have a title");
    }

    // METHOD 1
    // const newNote = new NoteModel({ title, text });
    // await newNote.save();

    // METHOD 2
    const newNote = await NoteModel.create({
      title,
      text,
    });

    res.status(200).json(newNote);
  } catch (error) {
    next(error);
  }
};

type ReqParamsType = {
  id: string;
};

export const updateNote: RequestHandler<
  ReqParamsType,
  unknown,
  ReqBodyType,
  unknown
> = async (req, res, next) => {
  const { id } = req.params;
  const { title, text } = req.body;

  try {
    if (!mongoose.isValidObjectId(id)) {
      throw createHttpError(400, "Invalid note id");
    }

    if (!title) {
      throw createHttpError(400, "Note must have a title");
    }

    const note = await NoteModel.findById(id).exec();

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    // METHOD 1
    // const updatedNote = await NoteModel.findByIdAndUpdate(
    //   id,
    //   { title, text },
    //   { new: true }
    // );

    // METHOD 2
    note.title = title;
    note.text = text;

    const updatedNote = await note.save();

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

export const deleteNote: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.isValidObjectId(id)) {
      throw createHttpError(400, "Invalid note id");
    }

    const note = await NoteModel.findById(id).exec();

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    // METHOD 1
    await note.deleteOne();

    // METHOD 2
    // await NoteModel.findByIdAndDelete(id);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
