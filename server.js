const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK (replace with your Firebase credentials)
const serviceAccount = {
  // Your Firebase service account credentials
  // ...
  "type": "service_account",
    "project_id": "online-academic-certificate",
    "private_key_id": "afe11c2495d344081a9743a0c3c340b6f23fc5a0",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQColDNwH6yvqh60\nXlCHGnPoF+1ptamNmKbXlgXadchWSMs7RXU2Pn8ZKPT//eHYozQ3SL/zXRTqYr0l\n4O3fO0NiXYGUfBzDvSn6tyTq9mzBTT03aheCwvgtRmMpKNYtFc9yf8iNPO/Kkxzm\nQ6wNFL/6ltmpqI9iUqz02SUn9Uyt74mtwjfMU0rbUKjODbc5GFoUH2rmN4H64SU5\nkvrYZYKCEW9zsMMrDEIzr17z7lvogN0Gz77GzbNMY74gT+u/geyVyvz1ekr7AHiF\n4Uhrjppd0XstQmVu7rBhSBwRg1loMA92ZnbkdvsqOBm6GP1nFpMnbrsvny2BbNnG\nU7Ep+UptAgMBAAECggEAGzFYwMfjN6zV6htimwB53ODrM4eRs50BoLn69LvWFpEE\nc2mnWBopr1nLd3WxFhxxYk+SYwPLSWmnADKxvDYXjwjtS5Hfo/ViDaa4Rkx8y4uV\nidhLtZSUqtz1RuDm93vSrDIPnDTNq1wip8QXvz5vH1FxB+yAQIh8jLxwQWtQtKew\n87qkzbV53SI7ow8rRaAy5y1UDH/WuNTwq6yTGqMXvyPME9gyc2Y19YfoqI27TtOx\ntUiHN3niLkrC9UXSyYWNxgS+Z0aG/gKOIGNtoRhsk/ApjQ+6oNqC8nBVogOW2YLX\n9JckTjkBqfnjtbhRLWJNZD1z4+Prm6ZE7SN4s0LWMwKBgQDslkhugpuyEjTM3Oee\nXgRa5kg8xISXhurDIit1WdMNmo2uz2nCT5LE11pUbHtyKZEcrBq6Znt80qeruWVm\nWVYtxWcnAs1iG0+UGsSaedYFyk7/hfoDp+ABP8eHKpPscEa3UuIHr5y7Izd6BT6R\nrOMH6NNUPdzbtG3O+h6yQl7CWwKBgQC2aVkOuA0EZijhfhQuabxPTQZ04gy6UccN\nhrUgjomuYCI9xlShPOdo54RkGu1jnJkeG3knruNARERakKVJM6XfM4SaGPZyhFW0\nEopdm12C/6o1sBcxzbaglAZ4cJYF9obJKBqZxPqbAepv/G9pnZ1it8zP0/ELYPiv\nAkvJdEkw1wKBgFCAoozX7FqfT1AWKsn8e8bibNoglG1q/x7+1YLM2b/bQzKkaPwx\nT2OjU50+fJLQCgyTk1Sx4nsKwvrvzs0QwP46GWtwzKoBWQawRQ27P1QhDthrojL0\nQIisRxx7JHJjkex3S2oKG26iARKIDk5LYcUjOCWGF0y7DFJNUXyekNfZAoGBAImU\nj50waHEG9JKO233eNi/Bsrr5vAvTnkSvc3Go0GN7EphxPGeYXhmbdRljzeSxujMh\nGZI6sCBK3RtJucCqedMNMlhft5HMCjAVQ9MyWadyWdjAhd4EgFhBDVhN4nmA5UxX\nOSj9jt7W5RGt3gJU5N4OLyYZftbMPwUQwESjtohlAoGBAKPm04pt64crHHV7Sd2Z\nyh6Y0lSStsC6bjMsezp56ac5Cqr/hfxJ5sUjOQ1Bao2LFWZ2j+sJ3WelCAxmAe1X\nFrx61GfY6YhJ9xkP3y2y/A39sjn9qRQW+brL5vgf9MNmXfCWkln6KkZVqQJE2yw5\n0WKgFO9Giwq4lMCyq6i0z2eC\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-b5v5k@online-academic-certificate.iam.gserviceaccount.com",
    "client_id": "103409079329658473532",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-b5v5k%40online-academic-certificate.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-firebase-database-url.firebaseio.com', // Replace with your Firebase database URL
});

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/verifyCertificate', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const imageBuffer = req.file.buffer;

  Tesseract.recognize(
    imageBuffer,
    'eng',
    { logger: info => console.log(info) }
  ).then(({ data: { text } }) => {
    // Perform certificate verification using the extracted text
    const certificateNumber = extractCertificateNumber(text);

    if (certificateNumber) {
      verifyCertificate(certificateNumber)
        .then(result => {
          res.json({ text, verificationResult: result });
        })
        .catch(error => {
          console.error('Verification error:', error);
          res.status(500).json({ error: 'Certificate verification failed.' });
        });
    } else {
      res.json({ text, verificationResult: 'Certificate number not found.' });
    }
  });
});

const { get, ref, child } = require('firebase/database');

// Placeholder for extracting the certificate number from text
function extractCertificateNumber(text) {
  // Replace this with your logic to extract the certificate number from the text
  const regex = /Hall\s*Ticket\s*No\s*:\s*(\d{10})/i;
  const match = text.match(regex);
  return match ? match[1] : null;
}

// Placeholder for verifying the certificate in Firebase
function verifyCertificate(certificateNumber) {
  // Replace this with your logic to verify the certificate in Firebase
  // Assume Firebase database structure: /certificates/{certificateNumber}
  const database = admin.database();
  const certificatesRef = ref(database, `certificates/${certificateNumber}`);

  return get(child(certificatesRef, 'verificationStatus'))
    .then(snapshot => {
      if (snapshot.exists()) {
        const verificationStatus = snapshot.val();
        return verificationStatus === 'verified';
      } else {
        return false; // Certificate not found
      }
    })
    .catch(error => {
      console.error('Firebase error:', error);
      throw new Error('Firebase verification failed.');
    });
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
