import React, { useEffect, useRef, useState } from 'react';
import './client_department.css'
import morePoints from '../../../../assets/more_horiz_black.svg';
import UpdateDepartment from '../../../update-department/UpdateDepartment';
import { URLS } from '../../../../URLS';
import { toast } from 'react-toastify';

interface ClientDepartmentProps {
    ID: number;
    nom: string;
    department: string;
    num_tel: string;
    email: string;
    isSelected?: boolean;
    onUpdate: () => void;
}

const ClientDepartment: React.FC<ClientDepartmentProps> = ({ ID, nom, department, num_tel, email, isSelected, onUpdate }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    function handleClickOutside(event: MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setDropdownOpen(false);
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleEdit = () => {
        setShowUpdateModal(true);
        setDropdownOpen(false);
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
        setDropdownOpen(false);
    };

    const confirmDelete = async () => {
        try {
            console.log("ID: ",ID);
            const response = await fetch(`${URLS.ServerIpAddress}/api/deleteDepartment`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ID:Number(ID) }),
                credentials: 'include'
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.message);
            }

            toast.success('Department deleted successfully');
            onUpdate();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete department');
        } finally {
            setShowDeleteModal(false);
        }
    };

    return (
        <>
            <div className={`client_department_div ${isSelected ? 'client_department_div--selected' : ''}`}>
                <div className="client_department_name_cell">
                    <div className="client_department_logo_name">
                        <span className="client_department_name">{nom}</span>
                    </div>
                </div>
                <div className="client_department_phone_cell">{num_tel}</div>
                <div className="client_department_email_cell">{email}</div>
                <div className="client_department_actions_cell" ref={dropdownRef}>
                    <button className="client_department_more_actions">
                        <img src={morePoints} alt="..." onClick={() => setDropdownOpen((prev) => (!prev))} />
                    </button>
                    {dropdownOpen && (
                        <div className="client_department_dropdown_menu">
                            <button className="dropdown_item" onClick={handleEdit}>Edit</button>
                            <button className="dropdown_item" onClick={handleDelete}>Delete</button>
                        </div>
                    )}
                </div>
            </div>
            {showUpdateModal && (
                <div className="modal-overlay">
                    <UpdateDepartment
                        department={{ ID, nom, department, num_tel, email }}
                        onClose={() => setShowUpdateModal(false)}
                        onUpdate={() => {
                            onUpdate();
                            setShowUpdateModal(false);
                        }}
                    />
                </div>
            )}
            {showDeleteModal && (
                <div className="delete-modal-overlay">
                    <div className="delete-modal">
                        <h3>Delete Department</h3>
                        <p>Are you sure you want to delete this department? This action cannot be undone.</p>
                        <div className="delete-modal-buttons">
                            <button className="delete-modal-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="delete-modal-confirm" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ClientDepartment;