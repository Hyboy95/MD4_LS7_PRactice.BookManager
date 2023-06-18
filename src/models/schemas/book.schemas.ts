
import { Schema, model } from "mongoose";

interface IBook {
    title: string;
    description: string;
    author: any;
    keywords: any;
}

const keywordsSchema = new Schema({
    keyword: String
})

const bookSchema = new Schema<IBook>({
    title: String,
    description: String,
    author: { type:Schema.Types.ObjectId, ref: "Author" },
    keywords: [keywordsSchema],
})

export const Book = model<IBook>('Book', bookSchema);
