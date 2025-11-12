import { useRef, useState } from "react"
import { Modal } from 'bootstrap';
import { validateForm } from "../validation/validateForm";
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import "./todoList.css";

export default function TodoList({todos, onToggleTodo, onAddTodo, onDeleteTodo, onUpdateTodo}) {

    const [selectedTodo, setSelectedTodo] = useState(null)
    const [errors, setErrors] = useState({})
    const [isAddAlertShowed, setIsAddAlertShowed] = useState(false)
    const [isUpdateAlertShowed, setIsUpdateAlertShowed] = useState(false)
    const [isDeleteAlertShowed, setIsDeleteAlertShowed] = useState(false)

    const [isAddFormValid, setIsAddFormValid] = useState(false)
    const [isUpdateFormValid, setIsUpdateFormValid] = useState(true)
    const [currentId, setCurrentId] = useState(2)

    const label = useRef()
    const details = useRef()
    const date = useRef()
    const time = useRef()


    const uLabel = useRef()
    const uDetails = useRef()
    const uDone = useRef()
    const uDate = useRef()
    const uTime = useRef()

    const displayTextInput = () => {
        return(
            <>
                <input type="text" 
                className={`form-control mt-1 ${errors['label'] ? 'border-danger' : ''}`} 
                ref={label}
                />
                {errors['label'] && <div className="text-danger mb-2">{errors['label']}</div>}
            </>
        )
    }

    const displayTextAreaInput = () => {
        return(
            <>
                <textarea
                className={`form-control mt-1 ${errors['details'] ? 'border-danger' : ''}`} 
                ref={details}
                ></textarea>
                {errors['details'] && <div className="text-danger mb-2">{errors['details']}</div>}
            </>
        )
    }

    const displayOtherInputs = (fieldName) => {
        return(
            <>
                <input type={fieldName === 'date' ? 'date' : 'time'}
                className={`form-control mt-1 ${errors[fieldName] ? 'border-danger' : ''}`} 
                ref={fieldName === 'date' ? date : time}
                />
                {errors[fieldName] && <div className="text-danger mb-2">{errors[fieldName]}</div>}
            </>
        )
    }

    const handleAddClick = () => {
        setErrors({})
        resetForm()
        const modal = new Modal(document.getElementById("addModal"))
        modal.show()
    }

    const handleDeleteClick = (todo) => {
        setSelectedTodo(todo);
        const modal = new Modal(document.getElementById("deleteModal"));
        modal.show();
    };

    const handleUpdateClick = (todo) => {
        setErrors({})
        setIsUpdateFormValid(false)
        setSelectedTodo(todo)
        const modal = new Modal(document.getElementById("updateModal"))
        modal.show()
    }

    const handleViewClick = (todo) => {
        setSelectedTodo(todo)
        const modal = new Modal(document.getElementById("viewModal"))
        modal.show()
    }

    const resetForm = () => {
        label.current.value = ''
        details.current.value = ''
        date.current.value = ''
        time.current.value = ''
    }

    const handleConfirmAdd = (e) => {
        e.preventDefault()
        const isValid = validateForm(label, details, date, time, setErrors)
        setIsAddFormValid(isValid)

        if(isValid){
            setIsAddAlertShowed(true)
            setIsAddFormValid(false)
            onAddTodo({
                id : currentId,
                label : label.current.value,
                details : details.current.value,
                date : date.current.value,
                time : time.current.value
            })
            resetForm()
            setCurrentId(currentId => currentId + 1)

            setTimeout(() => {
                setIsAddAlertShowed(false)
            }, 5000)
        }
    }

    const handleConfirmDelete = () => {
        if (selectedTodo) {
            onDeleteTodo(selectedTodo.id);
            setSelectedTodo(null);
            setIsDeleteAlertShowed(true)

            setTimeout(() => {
                setIsDeleteAlertShowed(false)
            }, 5000)
        }
    };

    const handleConfirmUpdate = (e) => {
        e.preventDefault()
        const isValid = validateForm(uLabel, uDetails, uDate, uTime, setErrors)
        setIsUpdateFormValid(isValid)

        if(selectedTodo && isValid) {
            onUpdateTodo({...selectedTodo})
            setSelectedTodo(null)

            setIsUpdateAlertShowed(true)

            setTimeout(() => {
                setIsUpdateAlertShowed(false)
            }, 5000)
        }
    }

    const displayTodos = () => {
        return todos.map(todo => {
            const rowStyle = `text-center ${todo.done ? 'done-row' : ''}`
            return <tr key={todo.id} onClick={() => handleViewClick(todo)} className={rowStyle}>
                <td><input type="checkbox" 
                className={`form-check-input 
                ${todo.done && 'bg-success'}`} 
                checked={todo.done} 
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {onToggleTodo(todo.id); e.stopPropagation()}}/></td>
                <td>{todo.date}</td>
                <td>{todo.time}</td>
                <td>{todo.label}</td>
                <td className="d-flex justify-content-center py-1">
                    <button className="btn btn-outline-info m-1" onClick={(e) => {handleUpdateClick(todo); e.stopPropagation()}}>Update</button>
                    <button type="button" className="btn btn-outline-danger m-1" onClick={(e) => {handleDeleteClick(todo); e.stopPropagation()}}>Delete</button>
                </td>
            </tr>
        })
    }

    const handleAddChange = () => {
        const isValid = validateForm(label, details, date, time, setErrors)
        setIsAddFormValid(isValid)
    }

    const handleUpdateChange = () => {
        const isValid = validateForm(uLabel, uDetails, uDate, uTime, setErrors)
        setIsUpdateFormValid(isValid)
    }

    const viewingTodo = () => {
        const viewDate = new Date(selectedTodo.date)
        const weekDay = viewDate.toLocaleDateString("en-GB", { weekday: "short" })
        const day = viewDate.getDate().toString()
        const month = viewDate.toLocaleDateString("en-GB", { month: "short" })
        const year = viewDate.getFullYear().toString().slice(2)

        let [hours, minutes] = selectedTodo.time.split(":");
        hours = String(parseInt(hours, 10));

        return( 
        <div className="modal-body">
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <span className="display-6">{hours}</span>
                    <span> : {minutes}</span>
                </div>

                <div className="fw-light">
                    <span className="display-6">{weekDay} {day}</span>
                    
                    <span> {month} {year}</span>
                </div>
            </div>
            <hr/>
            <div className="d-flex align-items-center justify-content-between">
                <h2 className="fw-light">{selectedTodo.label}</h2>
                {
                    selectedTodo.done 
                    ? <div className="d-flex align-items-center gap-1">
                        <span className="text-success">Done</span>
                        <CheckIcon sx={{ fontSize : "1.7rem", color : "success.main" }}/>
                    </div>
                    : <div className="d-flex align-items-center gap-1">
                        <span className="text-danger">Undone</span>
                        <CloseIcon sx={{ fontSize : "1.7rem", color : "error.main" }}/>
                    </div>
                }
            </div>
            <p className="fw-light text-muted">{selectedTodo.details}</p>
        </div>)
    }

    return(
        <div className="container">
            <div className="my-2">
                <Collapse in={isAddAlertShowed}>
                    <Alert
                        severity="success"
                        onClose={() => setIsAddAlertShowed(false)}
                        sx={{mb : 1}}>
                        <b>You added a new Todo successfully</b>
                    </Alert>
                </Collapse>
                <Collapse in={isUpdateAlertShowed}>
                    <Alert
                        severity="info"
                        icon={<CheckIcon fontSize="inherit"/>}
                        onClose={() => setIsUpdateAlertShowed(false)}
                        sx={{mb : 1}}>
                        <b>You updated the selected Todo successfully</b>
                    </Alert>
                </Collapse>
                <Collapse in={isDeleteAlertShowed}>
                    <Alert
                        severity="error"
                        onClose={() => setIsDeleteAlertShowed(false)}
                        sx={{mb : 1}}>
                        <b>You deleted the selected Todo permanently</b>
                    </Alert>
                </Collapse>
            </div>
            <div className="d-flex align-items-center justify-content-between">
                <h2>TODOs List</h2>
                <button className="btn btn-outline-success" onClick={handleAddClick}>New</button>
            </div>
            <hr />
            <table className="table">
                <thead>
                    <tr className="text-center">
                        <th>Done</th>
                        <th>Date</th>
                        <th>Time (24H Format)</th>
                        <th>Label</th>
                        <th>Operations</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        todos.length > 0 ? 
                        displayTodos() :
                        <tr>
                            <td colSpan={6} align="center">Your schedule is free</td>
                        </tr>
                    }
                </tbody>
            </table>

            {/* View modal */}
            <div
                className="modal fade"
                id="viewModal"
                tabIndex="-1"
                aria-labelledby="viewModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                    <h5 className="modal-title" id="viewModalLabel">
                        View Todo
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                    </div> 
                    {
                        selectedTodo ? viewingTodo() : <div><h2 className="m-3">No selected Todo</h2></div>
                    }
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            data-bs-dismiss="modal"
                        >
                            Return
                        </button>
                    </div>
                </div>
                </div>
            </div>

            {/* Adding modal */}
            <div
                className="modal fade"
                id="addModal"
                tabIndex="-1"
                aria-labelledby="addModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                    <h5 className="modal-title" id="addModalLabel">
                        What's next ?
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleConfirmAdd} onChange={handleAddChange}>
                            <label className="my-1">Label</label> 
                            {displayTextInput()}
                            <label className="my-1">Details</label>
                            {displayTextAreaInput()}
                            <label className="my-1">Date</label>
                            {displayOtherInputs('date')}
                            <label className="my-1">Time</label>
                            {displayOtherInputs('time')}
                            <div className="my-3">
                                <input
                                    type="submit"
                                    value="Add"
                                    className="btn btn-outline-success me-2"
                                    data-bs-dismiss="modal"
                                    disabled={!isAddFormValid}
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                </div>
            </div>

            {/* Deleting modal */}
            <div
                className="modal fade"
                id="deleteModal"
                tabIndex="-1"
                aria-labelledby="deleteModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                    <h5 className="modal-title" id="deleteModalLabel">
                        Confirm deleting Todo
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                    </div>
                    {
                        selectedTodo ? 
                        <div className="modal-body">
                            <h4>{selectedTodo.label}</h4>
                            <p>{selectedTodo.details}</p>
                        </div>
                        : <div className="modal-body">
                            <p className="fw-10">No Todo selected</p>
                        </div>
                    }
                    <div className="modal-footer d-flex justify-content-between">
                        {
                            !selectedTodo?.done && <span className="text-danger">
                                This todo is undone !
                            </span>
                        }
                        <div className="ms-auto">
                            <button
                            type="button"
                            className="btn btn-outline-danger me-2"
                            data-bs-dismiss="modal"
                            onClick={handleConfirmDelete}
                            >{
                                !selectedTodo?.done ? "Delete anyway" : "Delete"
                            }</button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                data-bs-dismiss="modal"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
                </div>
            </div>

            {/* Updating modal */}
            <div
                className="modal fade"
                id="updateModal"
                tabIndex="-1"
                aria-labelledby="updateModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                    <h5 className="modal-title" id="updateModalLabel">
                        Update Todo
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleConfirmUpdate} onChange={handleUpdateChange}>
                            
                            Label 
                            <input type="text" 
                            value={selectedTodo?.label} 
                            onChange={(e) => setSelectedTodo({...selectedTodo, label : e.target.value})} 
                            className={`form-control mt-2 ${errors.label ? 'border-danger' : ''}`} 
                            ref={uLabel}/>

                            {errors.label && <div className="text-danger mb-2">{errors.label}</div>}

                            Details 
                            <textarea 
                            value={selectedTodo?.details} 
                            onChange={(e) => setSelectedTodo({...selectedTodo, details : e.target.value})} 
                            className={`form-control mt-2 ${errors.details ? 'border-danger' : ''}`} 
                            ref={uDetails}></textarea>

                            {errors.details && <div className="text-danger mb-2">{errors.details}</div>}

                            Date 
                            <input type="date" 
                            value={selectedTodo?.date} 
                            onChange={(e) => setSelectedTodo({...selectedTodo, date : e.target.value})} 
                            className={`form-control mt-2 ${errors.date ? 'border-danger' : ''}`} 
                            ref={uDate}/>

                            {errors.date && <div className="text-danger mb-2">{errors.date}</div>}

                            Time 
                            <input type="time" 
                            value={selectedTodo?.time} 
                            onChange={(e) => setSelectedTodo({...selectedTodo, time : e.target.value})} 
                            className={`form-control mt-2 ${errors.time ? 'border-danger' : ''}`} 
                            ref={uTime}/>

                            {errors.time && <div className="text-danger mb-2">{errors.time}</div>}

                            <div className="mt-2">
                                <input type="checkbox" 
                                checked={selectedTodo?.done} 
                                id="uDone" 
                                onChange={(e) => setSelectedTodo({...selectedTodo, done : e.target.checked})} 
                                className={`form-check-input m-1 ${selectedTodo?.done && 'bg-info'}`} ref={uDone}/>
                                <label htmlFor="uDone">Is it done ?</label> 
                            </div>
                            <hr />
                            <div className="my-3">
                                <input
                                    type="submit"
                                    value="Update"
                                    className="btn btn-outline-info me-2"
                                    data-bs-dismiss="modal"
                                    disabled={!isUpdateFormValid}
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}