import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useEffect } from 'react';

import { useStateContext } from '../context';

import { CustomButton, FormField, Loader } from '../components';
// import { checkIfImage } from '../utils';

import { useStorageUpload } from "@thirdweb-dev/react";


const CreateCampaign = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const { createCampaign } = useStateContext();
	const [form, setForm] = useState({
		name: '',
		title: '',
		description: '',
		target: '',
		deadline: '',
		tokenName: '',
		tokenSym:'',
		image: ''
	});

	const { mutateAsync: upload } = useStorageUpload();
	// const [data, setData] = useState();
	const [ipfsdata, setipfsData] = useState("");

	const uploadData = async (data) => {
		// Get any data that you want to upload
		setipfsData("Uploading...")
		const dataToUpload = [data];
		console.log(data);

		// And upload the data with the upload function
		const uris = await upload({ data: dataToUpload });
		const upl = uris[0]
		// this.setForm({image : upl},()=>{
		// 	console.log(this.form.image);
		// })
		setForm({...form, image:upl})
		setipfsData(upl)
	}

	useEffect(()=>{
		console.log("data",form.image);
	},[form.image])

	const handleFormFieldChange = (fieldName, e) => {
		setForm({ ...form, [fieldName]: e.target.value })
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true)
		await createCampaign({ ...form, target: ethers.utils.parseUnits(form.target, 18) })
		setIsLoading(false);
		navigate('/');
		// checkIfImage(form.image, async (exists) => {
		// 	if (exists) {
				
		// 	} else {
		// 		alert('Provide valid image URL')
		// 		setForm({ ...form, image: '' });
		// 	}
		// })
	}

	return (
		<div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
			{isLoading && <Loader />}
			<div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
				<h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Start a Campaign</h1>
			</div>

			<form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
				<div className="flex flex-wrap gap-[40px]">
					{/* <FormField
						labelName="Your Name *"
						placeholder="John Doe"
						inputType="text"
						value={form.name}
						handleChange={(e) => handleFormFieldChange('name', e)}
					/> */}
					<FormField
						labelName="Campaign Title *"
						placeholder="Write a title"
						inputType="text"
						value={form.title}
						handleChange={(e) => handleFormFieldChange('title', e)}
					/>
				</div>

				<FormField
					labelName="Story *"
					placeholder="Write your story"
					isTextArea
					value={form.description}
					handleChange={(e) => handleFormFieldChange('description', e)}
				/>

				{/* <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
					<img src={money} alt="money" className="w-[40px] h-[40px] object-contain" />
					<h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">You will get 100% of the raised amount</h4>
				</div> */}

				<div className="flex flex-wrap gap-[40px]">
					<FormField
						labelName="Goal *"
						placeholder="MATIC 0.50"
						inputType="text"
						value={form.target}
						handleChange={(e) => handleFormFieldChange('target', e)}
					/>
					<FormField
						labelName="End Date *"
						placeholder="End Date"
						inputType="date"
						value={form.deadline}
						handleChange={(e) => handleFormFieldChange('deadline', e)}
					/>
				</div>

				<div className="flex flex-wrap gap-[40px]">
					<FormField
						labelName="Token Name *"
						placeholder="Name of Token that will be issued"
						inputType="text"
						value={form.tokenName}
						handleChange={(e) => handleFormFieldChange('tokenName', e)}
					/>
					<FormField
						labelName="Token Symbol *"
						placeholder="Symbol of token that will be issued"
						inputType="text"
						value={form.tokenSym}
						handleChange={(e) => handleFormFieldChange('tokenSym', e)}
					/>
				</div>

				<div>
				<FormField
					labelName="Campaign image *"
					placeholder="Place image URL of your campaign"
					inputType="file"
					isFileUpload
					handleChange={(e) => uploadData(e.target.files[0])}
				/>
				{(ipfsdata!=="") ? 
					<div className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mt-[10px]">{ipfsdata}
				</div>: 
					<div className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mt-[10px]">Image Not Uploaded
				</div>}
				</div>

				<div className="flex justify-center items-center mt-[40px]">
					<CustomButton
						btnType="submit"
						title="Submit new campaign"
						styles="bg-[#2196f3]"
					/>
				</div>
			</form>
		</div>
	)
}

export default CreateCampaign