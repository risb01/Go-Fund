import React from 'react'

const FormField = ({ labelName, placeholder, inputType, isFileUpload,isTextArea, value, handleChange }) => {
    return (
        <label className="flex-1 w-full flex flex-col">
            {labelName && (
                <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">{labelName}</span>
            )}
            {isTextArea ? (
                <textarea
                    required
                    value={value}
                    onChange={handleChange}
                    rows={10}
                    placeholder={placeholder}
                    className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
                />
            ) : (
                    isFileUpload ? 
                (<input
                    required
                    value={value}
                    onChange={handleChange}
                    type={inputType}
                    placeholder={placeholder}
                            className="block w-full border-[1px] border-[#3a3a43] bg-transparent rounded-[10px] py-[15px] px-[15px] font-epilogue text-white text-[14px] file:cursor-pointer file:font-epilogue file:font-bold file:-mx-[15px] file:-my-[30px] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-[#3a3a43] file:text-white file:px-6 file:py-[30px] file:[margin-inline-end:0.75rem] file:[border-inline-end-width:1px]"
                />

                        ) : (<input
                            required
                            value={value}
                            onChange={handleChange}
                            type={inputType}
                            step="0.1"
                            placeholder={placeholder}
                            className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
                        />)
                
            )}
        </label>
    )
}

export default FormField