import { Button } from 'bootstrap'
import React, { useState } from 'react'
import { storage,firestore } from '../Config/Config';
import { collection ,ref,getDownloadURL,uploadBytesResumable,addDoc} from '../Config/Config';

export const Addproduct = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState(null);
    const [imageError, setImageError] = useState("");
    const [success, setSuccess] = useState("");
    const [uploadError, setUploadError] = useState("");
    const [catergory,SetCategory]=useState('');

    const imageTypes = ["image/jpg", "image/jpeg", "image/png", "image/PNG"];

    const handleUploadImage = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            if (imageTypes.includes(selectedFile.type)) {
                setImage(selectedFile);
                setImageError('');
            } else {
                setImage(null);
                setImageError("Please select a valid file type (png or jpg)");
            }
        } else {
            console.log("Please select a file");
        }
    };

    const handleAddProducts = (e) => {
        e.preventDefault();

        if (image) {
            const imageRef = ref(storage, `product-image/${image.name}`);
            const uploadTask = uploadBytesResumable(imageRef, image);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    setUploadError(error.message);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        addDoc(collection(firestore, 'Products'), {
                            title,
                            description,
                            catergory,
                            price: Number(price),
                            url: downloadURL,
                        })
                        .then(() => {
                            setSuccess('Product added successfully');
                            setTitle('');
                            setDescription('');
                            setPrice('');
                            document.getElementById('file').value = "";
                            setImage(null);
                            setImageError('');
                            setUploadError('');
                            setTimeout(() => {
                                setSuccess('');
                            }, 3000);
                        })
                        .catch((error) => setUploadError(error.message));
                    });
                }
            );
        } else {
            setImageError("Please upload an image");
        }
    };

    return (
        <div className='container'>
            <h1>Add Product</h1>
            <hr />
            {success && <div className='success-msg'>{success}</div>}
            {uploadError && <div className='error-msg'>{uploadError}</div>}

            <form autoComplete='off' className='form-group' onSubmit={handleAddProducts}>
                <label>Product Title</label>
                <input type='text' className='form_control' required onChange={(e) => setTitle(e.target.value)} value={title} />
                <br />
                <label>Product Description</label>
                <input type='text' className='form_control' required onChange={(e) => setDescription(e.target.value)} value={description} />
                <br />
                <label>Product Price</label>
                <input type='number' className='form_control' required onChange={(e) => setPrice(e.target.value)} value={price} />
                <br />
                <br />
                <label>Product Category</label>
                <select className='form-control' required
                value={catergory} onChange={(e)=>SetCategory(e.target.value)}>                                    
                    <option value="">Select Product Category</option>                   
                    <option>Electronic Devices</option>
                    <option>Mobile Accessories</option>
                    <option>TV & Home Appliances</option>
                    <option>Sports & outdoors</option>
                    <option>Health & Beauty</option>
                    <option>Home & Lifestyle</option>
                    <option>Men's Fashion</option>
                    <option>Watches, bags & Jewellery</option>
                    <option>Groceries</option>
                </select>
                <label>Upload Product Image</label>
                <input type='file' id='file' className='form_control' onChange={handleUploadImage} required />
                <br />
                {imageError && <div className='error-msg'>{imageError}</div>}
                <div>
                    <button type='submit'>Submit</button>
                </div>
            </form>
        </div>
    );
};
