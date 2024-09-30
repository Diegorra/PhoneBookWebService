const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://diego:${password}@cluster0.72epk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  
mongoose.set('strictQuery',false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
    name: String,
    phone: String,
})

const Contact = mongoose.model('Contact', contactSchema)

if (process.argv.length == 5) {
    const newContact = new Contact({
        name: process.argv[3],
        phone: process.argv[4],
    })

    newContact.save().then(result => {
        console.log(`added ${result.name} number ${result.phone} to phonebook`)
        mongoose.connection.close()
    })
} else {
    Contact.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(contact => {
            console.log(`${contact.name} ${contact.phone}`)
        });
        mongoose.connection.close()
    })
}


