/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/things              ->  index
 * POST    /api/things              ->  create
 * GET     /api/things/:id          ->  show
 * PUT     /api/things/:id          ->  upsert
 * PATCH   /api/things/:id          ->  patch
 * DELETE  /api/things/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Fixture from '../season/fixture.model';
import Team from '../team/team.model';
import {getPars} from './par.functions';

function respondWithResult(res, statusCode) {
  
  statusCode = statusCode || 200;
  return function(entity) {
    console.log('entity');
    console.log(entity);
    if(entity!==undefined) {
      console.log('returning');
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

export function index(req, res) {
    
    var sid = req.query.seasonId;
    
     getPars(sid).then(function(pars) {
             
      return res.status(200).json(pars);

        });


     // return getSeason(season)
      // .then(respondWithResult(res));
      
 
 // return Season.find().exec()
  //  .then(respondWithResult(res))
   //.catch(handleError(res));
}
 