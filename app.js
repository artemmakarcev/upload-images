import { initializeApp } from 'firebase/app'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import {upload} from './upload.js'


const firebaseConfig = {
  apiKey: "AIzaSyAi6w4QQ9dxvPz5cWAgkwt1Ne231rG65tM",
  authDomain: "fe-upload.firebaseapp.com",
  projectId: "fe-upload",
  storageBucket: "fe-upload.appspot.com",
  messagingSenderId: "88071581063",
  appId: "1:88071581063:web:26caeb285967172a2fb722"
}

const firebase = initializeApp(firebaseConfig)

const storage = getStorage(firebase)

const metadata = {
  contentType: 'image/jpeg',
}

upload('#file', {
  multi: true,
  accept: ['.png', '.jpg', '.jpeg', '.gif'],
  onUpload(files, blocks) {
    files.forEach((file, index) => {
      const storageRef = ref(storage, `images/${file.name}`)
      const task = uploadBytesResumable(storageRef, file, metadata)

      task.on('state_changed', snapshot => {
        const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%'
        const block = blocks[index].querySelector('.preview-info-progress')
        block.textContent = percentage
        block.style.width = percentage
      }, error => {
        console.log(error)
      }, () => {
        getDownloadURL(task.snapshot.ref).then((url) => {
          console.log('Download URL', url)
        })
      })
    })
  }
})