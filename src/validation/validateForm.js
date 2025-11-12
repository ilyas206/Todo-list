export const validateForm = (label, details, date, time, setErrors) => {
    setErrors({})
    
    const labelValue = label.current.value
    const detailsValue = details.current.value
    const dateValue = date.current.value
    const timeValue = time.current.value
    let isFormValid = true

    // Title validation

    const maxLabelLength = 20

    if(labelValue.trim() === ''){
        setErrors(prevState => {
            return {...prevState, 
            ...{label : "Field required"}}
        })
        isFormValid = false
    }else if(maxLabelLength <= labelValue.length) {
        setErrors(prevState => {
            return {...prevState, 
            ...{label : `Too long ! Label should be less than ${maxLabelLength} characters`}}
        })
        isFormValid = false
    }

    // Details validation

    const minDetailsLength = 25
    const maxDetailsLength = 120
    const currentDetailsLength = detailsValue.length
    
    if(detailsValue.trim() === ''){
        setErrors(prevState => {
            return {...prevState, 
            ...{details : "Field required"}}
        })
        isFormValid = false
    }else if(minDetailsLength > currentDetailsLength){
        setErrors(prevState => {
            return {
                ...prevState,
                ...{details : `Too short ! Details should be greater than ${minDetailsLength} characters (${currentDetailsLength} / ${minDetailsLength})`}
            }
        })
        isFormValid = false
    }else if(maxDetailsLength <= currentDetailsLength ){
        setErrors(prevState => {
            return {
                ...prevState,
                ...{details : `Too long ! Details should be less than ${maxDetailsLength} characters`}
            }
        })
        isFormValid = false
    }

    // Date validation

    if(dateValue.trim() === ''){
        setErrors(prevState => {
            return {
                ...prevState,
                ...{date : "Date should be specified"}
            }
        })
        isFormValid = false
    }else {
        const selectedDate = new Date(dateValue)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if(isNaN(selectedDate.getTime())){
            setErrors(prevState => {
                return {
                    ...prevState,
                    ...{date : "Invalid date format"}
                }
            })
            isFormValid = false
        }else if(selectedDate < today) {
            setErrors(prevState => {
                return {
                    ...prevState,
                    ...{date : "Date cannot be in the past"}
                }
            })
            isFormValid = false
        }
    }

    // Time validation

    if(timeValue.trim() === ''){
        setErrors(prevState => {
            return {
                ...prevState,
                ...{time : "Time should be specified"}
            }
        })
        isFormValid = false
    }else {
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if(!timeRegex.test(timeValue)) {
            setErrors(prevState => ({
                ...prevState,
                time: "Invalid time format (HH:MM)"
            }));
            isFormValid = false;
        }
    }


    return isFormValid
}