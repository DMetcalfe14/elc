const express = require('express');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const Minio = require('minio');
require('dotenv').config();

const router = express.Router();

// Postgres configuration
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

if(process.env.MINIO_ACCESS_KEY && process.env.MINIO_SECRET_KEY) {
// MinIO client configuration
const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT),
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    region: 'eu-west-2',
  });
}

// Create a course
router.post('/', async (req, res) => {
    const { name, description, type, duration, thumbnail, url, proficiency, active } = req.body;

    try {
        const newCourse = await pool.query(
            `INSERT INTO courses (id, name, description, type, duration, thumbnail, url, proficiency, active, "updatedAt")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
            RETURNING *`,
            [uuidv4(), name, description, type, duration, thumbnail, url, proficiency, active]
        );
        res.status(201).json(newCourse.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read all courses
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM courses');
        const courses = result.rows;

        // For each course, generate a presigned URL for the thumbnail
        const coursesWithThumbnails = await Promise.all(courses.map(async (course) => {
            try {
                // Generate a presigned URL valid for 24 hours
                const presignedUrl = await minioClient.presignedGetObject(
                    'elc',
                    course.thumbnail,
                    24 * 60 * 60 // URL expiration time in seconds (24 hours)
                );
                return {
                    ...course,
                    thumbnailUrl: presignedUrl // Include the presigned URL in the course object
                };
            } catch (err) {
                console.error(`Error generating presigned URL for ${course.thumbnail}`, err);
                return course; // If error, return course without URL
            }
        }));

        res.json(coursesWithThumbnails);
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Read a single course
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const course = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);
        if (course.rows.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(course.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a course
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, type, duration, thumbnail, url, proficiency, active } = req.body;

    try {
        const updatedCourse = await pool.query(
            `UPDATE courses SET name = $1, description = $2, type = $3, duration = $4, thumbnail = $5, url = $6, proficiency = $7, active = $8, "updatedAt" = NOW()
            WHERE id = $9 RETURNING *`,
            [name, description, type, duration, thumbnail, url, proficiency, active, id]
        );

        if (updatedCourse.rows.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(updatedCourse.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a course
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCourse = await pool.query('DELETE FROM courses WHERE id = $1 RETURNING *', [id]);
        if (deletedCourse.rows.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(deletedCourse.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;