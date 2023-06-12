import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

// Entidad hace referencia como vamos a grabar en la BD
// (Document) => agrega funcionalidades métodos

@Schema()
export class Pokemon extends Document {
    
    @Prop({
        unique:true,
        index:true
    })
    name:string;

    @Prop({
        unique:true,
        index:true
    })
    no:number;
}


export const PokemonSchema = SchemaFactory.createForClass( Pokemon );
