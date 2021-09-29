require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongo = require('mongodb');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
