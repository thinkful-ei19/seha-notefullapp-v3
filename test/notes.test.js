'use strict';
const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const { TEST_MONGODB_URI } = require('../config');

const Note = require('../models/note');
const seedNotes = require('../db/seed/notes');

const expect = chai.expect;
chai.use(chaiHttp);


describe('Notes API resource', function () {

  before(function () {
    console.log(TEST_MONGODB_URI, 'TEST URL CONSOLE');
    return mongoose.connect(TEST_MONGODB_URI);
  });

  beforeEach(function () {
    return Note.insertMany(seedNotes)
      .then(() => Note.createIndexes());
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe('GET /api/notes', function () {
    it('should return the correct number of Notes', function () {
      // 1) Call the database and the API
      const dbPromise = Note.find();
      const apiPromise = chai.request(app).get('/api/notes');
      // 2) Wait for both promises to resolve using `Promise.all`
      return Promise.all([dbPromise, apiPromise])
      // 3) **then** compare database results to API response
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        });
    });

  });

  describe('GET /api/notes/:id', function () {
    it('should return correct notes', function () {
      let data;
      // 1) First, call the database
      return Note.findOne().select('id title content')
        .then(_data => {
          data = _data;
          // 2) **then** call the API
          return chai.request(app).get(`/api/notes/${data.id}`);
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;

          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('id', 'title', 'created', 'content');

          // 3) **then** compare
          expect(res.body.id).to.equal(data.id);
          expect(res.body.title).to.equal(data.title);
          expect(res.body.content).to.equal(data.content);
        });
    });

  });


  describe('POST /api/notes', function () {
    it('should create and return a new item when provided valid data', function () {
      const newItem = {
        'title': 'The best article about cats ever!',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...',
        'tags': []
      };
      let body;
      // 1) First, call the API
      return chai.request(app)
        .post('/api/notes')
        .send(newItem)
        .then(function (res) {
          body = res.body;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(body).to.be.a('object');
          expect(body).to.include.keys('id', 'title', 'content');
          // 2) **then** call the database
          return Note.findById(body.id);
        })
      // 3) **then** compare
        .then(data => {
          expect(body.title).to.equal(data.title);
          expect(body.content).to.equal(data.content);
        });
    });
    it('should return error when title is not provided', function () {
      const newItem = {
        content: 'Lorem ipsum...'
      };
      return chai.request(app)
        .post('/api/notes')
        .send(newItem)
        .catch(err => err.response)
        .then(function (res) {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing `title` in request body');
        });
    });
  });

  describe('PUT endpoint', function () {
    it('should update notes', function () {
      const updateNote = {
        'title': 'Cat Love',
        'content': 'Why do cats purr?'
      };

      return Note
        .findOne()
        .then(function (note) {
          updateNote.id = note.id;

          return chai.request(app)
            .put(`/api/notes/${note.id}`)
            .send(updateNote);
        })
        .then(function (res) {
          expect(res).to.have.status(200);

          return Note.findById(updateNote.id);
        })
        .then(function (note) {
          expect(note.title).to.equal(updateNote.title);
          expect(note.content).to.equal(updateNote.content);
        });
    });
    it('should respond with a 404 for an invalid id', function () {
      const updateItem = {
        'title': 'Cat Love',
        'content': 'Why do cats purr?'
      };

      return chai.request(app)
        .put('/api/notes/AAAAAAAAAAAAAAAAAAAAAAAA')
        .send(updateItem)
        .catch(err => err.response)
        .then(res => {
          expect(res).to.have.status(200);
        });
    });
  });

  describe('DELETE endpoint', function () {

    it('delete note by id', function () {

      let note;

      return Note
        .findOne()
        .then(function (_note) {
          note = _note;
          return chai.request(app).delete(`/api/notes/${note.id}`);
        })
        .then(function (res) {
          expect(res).to.have.status(204);
          return Note.findById(note.id);
        })
        .then(function (_note) {
          expect(_note).to.be.null;
        });
    });
    it('should respond with a 204 for an invalid id', function () {

      return chai.request(app)
        .delete('/api/notes/AAAAAAAAAAAAAAAAAAAAAAAA')
        .catch(err => err.response)
        .then(res => {
          expect(res).to.have.status(204);
        });
    });
  });
});
