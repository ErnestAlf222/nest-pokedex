import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {

  constructor( 
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>){

  }

  // Todo Creación del pokemón
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    
    try {
      // Creación en la bd registro inserción
      const pokemon = await  this.pokemonModel.create( createPokemonDto ); 
      return pokemon;
      
    } catch (error) {
      this.handleExceptions(error);
      
    }
  }
  

  // Todo Listado de pokemóns
  findAll() {
    return `This action returns all pokemon`;
  }
  
  
  // Todo Busqueda de un  pokemón
  async findOne(terminoBusqueda: string) {
    let pokemon: Pokemon;
    
    // Si (!isNaN) => Es un número
    if (!isNaN(+terminoBusqueda)) {
      pokemon =  await this.pokemonModel.findOne({no:terminoBusqueda})
      
    }
    // MongoID
    if(!pokemon && isValidObjectId(terminoBusqueda)){
      pokemon= await this.pokemonModel.findById(terminoBusqueda)
    }
    
    // Name
    if(!pokemon){
      pokemon = await this.pokemonModel.findOne({name:terminoBusqueda.toLowerCase().trim()})
    }
    if(!pokemon) throw new NotFoundException(`Pokemon with id, name or no "${terminoBusqueda}" not found`);
    
    
    return pokemon;
  }
  
  
  
  
  // Todo Actualización de un  pokemón
  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await  this.findOne(term);
    if(updatePokemonDto.name)
    updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    
    try {
      await pokemon.updateOne(updatePokemonDto)
      return { ...pokemon.toJSON(), ...updatePokemonDto };
      
    } catch (error) {
      this.handleExceptions(error);
      
    }
    
  }
  
  // Todo Eliminación de un  pokemón
  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    // return { id };

    // const result = await this.pokemonModel.findByIdAndDelete(id);
    const {deletedCount } = await this.pokemonModel.deleteOne({_id: id});
    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id "${id}" not found`)
      
    }
    return;

  }



  // * Manejo de errores similares
  
  private handleExceptions( error:any ){
    if(error.code === 11000){
      throw new BadRequestException(`Pokemon exist in db ${JSON.stringify(error.keyValue)}`)
    }
    console.log(error);
  throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);
  } 
}
