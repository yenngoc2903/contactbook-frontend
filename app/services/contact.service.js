const { ObjectId } = require("mongodb");

class ContactService {
  constructor(client) {
    this.Contact = client.db().collection("contacts");
  }

  async find(filter) {
    const cursor = await this.Contact.find(filter);
    return await cursor.toArray();
    }
    async findByName(name) {
    return await this.find({
    name: { $regex: new RegExp(name), $options: "i" },
    });
  }

  async findById(id) {
    console.log(id)
    return await this.Contact.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update (id, payload) {
    let filter = {
        _id: ObjectId.isValid(id) ? new ObjectId(id) : null, 
    }

    const newContact = this.extractContactData(payload)
    const result = await this.Contact.findOneAndUpdate(
        filter,
        { $set: newContact },
        { returnDocument: 'after' }
    )
    return result
  }

  async delete(id) {
    const result = await this.Contact.findOneAndDelete({
    _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result
  }

  async findFavorite() {
    return await this.find({ favorite: true });
    }

    async deleteAll() {
      const result = await this.Contact.deleteMany({});
      return result.deletedCount;
    }

  // Extract contact data and remove undefined fields
  extractContactData(payload) {
    const contact = {
      name: payload.name,
      email: payload.email,
      address: payload.address,
      phone: payload.phone,
      favorite: payload.favorite,
    };

    // Remove undefined fields
    Object.keys(contact).forEach(
      (key) => contact[key] === undefined && delete contact[key]
    );

    return contact;
  }

  // Create a new contact
  async create(payload) {
    const contact = this.extractContactData(payload);

    const result = await this.Contact.findOneAndUpdate(
      { email: contact.email },
      { $set: { ...contact } },
      { returnDocument: "after", upsert: true }
    );

    return result.value;
  }
}

module.exports = ContactService;
