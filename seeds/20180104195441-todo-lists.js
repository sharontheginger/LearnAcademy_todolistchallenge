'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
     return queryInterface.bulkInsert('TodoLists',  //Notice the plural here
         [
           {
             name: 'House Chores',
             createdAt: new Date(), // we need to add the manually for seeds
             updatedAt: new Date()
           },
           {
             name: 'Work Tasks',
             createdAt: new Date(),
             updatedAt: new Date()
           }
         ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('TodoLists', null, {})
  }
};
