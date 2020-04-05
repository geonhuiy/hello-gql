"use strict";
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
} = require("graphql");

const category = require("../models/category");
const species = require("../models/species");
const animal = require("../models/animal");

const animalType = new GraphQLObjectType({
  name: "animal",
  description: "Animal name and species",
  fields: () => ({
    id: { type: GraphQLID },
    animalName: { type: GraphQLString },
    species: {
      type: speciesType,
      resolve: async (parent, args) => {
        //return speciesData.find((species) => species.id === parent.id);
        try {
          return await species.findById(parent.species);
        } catch (e) {
          return new Error("Animal type error," + e.message);
        }
      },
    },
  }),
});

const speciesType = new GraphQLObjectType({
  name: "species",
  description: "Animal species",
  fields: () => ({
    id: { type: GraphQLID },
    speciesName: { type: GraphQLString },
    category: {
      type: categoryType,
      resolve: async (parent, args) => {
        //return categoryData.find((category) => category.id === parent.category);
        try {
          return await category.findById(parent.category);
        } catch (e) {
          return new Error("Animal species error," + e.message);
        }
      },
    },
  }),
});

const categoryType = new GraphQLObjectType({
  name: "category",
  description: "Animal category",
  fields: () => ({
    id: { type: GraphQLID },
    categoryName: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  description: "Main query",
  fields: {
    animals: {
      type: new GraphQLList(animalType),
      description: "Get all animals",
      resolve: async (parent, args) => {
        try {
          return await animal.find();
        } catch (e) {
          return new Error("All animals error," + e.message);
        }
      },
    },
    animal: {
      type: animalType,
      description: "Get single animal",
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, args) => {
        try {
          return await animal.findById(args.id);
        } catch (e) {
          return new Error("Single animal error," + e.message);
        }
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "MutationType",
  description: "Mutations...",
  fields: {
    addCategory: {
      type: categoryType,
      description: "Add animal category like Fish, Mammal, etc.",
      args: {
        categoryName: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        try {
          const newCategory = new category({
            categoryName: args.categoryName,
          });
          return await newCategory.save();
        } catch (e) {
          return new Error("Add category error," + e.message);
        }
      },
    },
    addSpecies: {
      type: speciesType,
      description: "Add animal species like cat, dog, etc.",
      args: {
        speciesName: { type: new GraphQLNonNull(GraphQLString) },
        categoryId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, args) => {
        /*const newSpecies = new species({
          speciesName: args.speciesName,
          category: args.categoryId,
        });*/
        try {
          const newSpecies = new species(args);
          return await newSpecies.save();
        } catch (e) {
          return new Error("Add species error," + e.message);
        }
      },
    },
    addAnimal: {
      type: animalType,
      description: "Add animal names",
      args: {
        animalName: { type: new GraphQLNonNull(GraphQLString) },
        species: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, args) => {
        try {
          const newAnimal = new animal(args);
          return await newAnimal.save();
        } catch (e) {
          return new Error("Add animal error," + e.message);
        }
      },
    },
    modifyAnimal: {
      type: animalType,
      description: "Modify animal name and species",
      args: {
        animalId: { type: new GraphQLNonNull(GraphQLID) },
        animalName: { type: GraphQLString },
        species: { type: GraphQLID },
      },
      resolve: async (parent, args) => {
        try {
          return await animal.findByIdAndUpdate(args.animalId, args, { new: true });
        } catch (e) {
          return new Error("Add animal error," + e.message);
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
