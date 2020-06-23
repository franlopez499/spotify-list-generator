import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Points =  new Mongo.Collection('points');


if(Meteor.isServer){
    // Server publica points para que se pueda suscribir clientes
    Meteor.publish('points', function pointsPublication(){
        return Points.find({
          });
    });
}

Meteor.methods({
    'points.insert'(lat, lng, descripcion, imageUrl){
        // Vemos si el tipo 'text' es String
        check(lat, Number);
        check(lng, Number);
        check(descripcion, String);
        check(imageUrl, String);



        /*if (!  this.userId) {
            throw new Meteor.Error('not-authorized');
        }*/

        Points.insert({
            lat,
            lng,
            createdAt: new Date(),
            descripcion,
            imageUrl,
            //owner: this.userId,           // _id of logged in user
            //username: Meteor.users.findOne(this.userId).username,  // username of logged in user
        });

    },

    'points.remove'(pointId){
        check(pointId, String);
        const point = Points.findOne(pointId); //TODOOOO
        if (task.owner !== this.userId) { // || admin ???
            // make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }
 
        Points.remove(pointId);
    },

    

});