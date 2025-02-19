const connectDB = require('../config/db');

class CitizenRepository {

    static async save(data) {
        const db = await connectDB();
        try {
            console.log(data.name)
            console.log(data.email)
            console.log(data.phone_number)

            const query = `
                INSERT INTO citizens (name, email, phone_number) 
                VALUES ($1, $2, $3)
                RETURNING id, name, email, phone_number;
            `;

            const result = await db.query(query, [
                data.name,
                data.email,
                data.phone_number
            ]);

            return result.rows[0];
        } catch (error) {
            console.error('Erro ao inserir cidadão:', error.message);
            throw error;
        }
    }
}

module.exports = CitizenRepository;
