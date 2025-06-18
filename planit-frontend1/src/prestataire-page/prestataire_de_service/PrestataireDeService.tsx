// Prestataires_page.tsx

import { Search } from 'lucide-react';
import { ChangeEvent, useEffect, useState, useCallback } from 'react';

import PrestataireElement from '../prestataire-element/PrestataireElement';
import Sidebar from '../../sidebar/Sidebar';
import { FETCH_STATUS } from '../../fetchStatus';
import './prestataires_page.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import arrowBack from '../assets/arrow_back_black.svg';
import arrowForward from '../assets/arrow_forward_black.svg';
import AddPrestataireModal from '../add-prestataire/AddPrestataireModal';
import UpdatePrestataireModal from '../update-prestataire/UpdatePrestataireModal';
import deleteGreyImg from '../assets/delete_24dp_grey.svg';
import { URLS } from '../../URLS'; // Assuming URLS.ServerIpAddress is defined here

interface Prestataire {
    ID: number;
    nom: string;
    email: string;
    num_tel: string;
    address: string;
    type: string;
}

interface SelectedItems {
    [key: string]: boolean;
}

function Prestataires_page() {
    const [status, setStatus] = useState<typeof FETCH_STATUS[keyof typeof FETCH_STATUS]>(FETCH_STATUS.IDLE);
    const [prestataires, setPrestataires] = useState<Prestataire[]>([]);
    const [selectedItems, setSelectedItems] = useState<SelectedItems>({});
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [prestataireToUpdate, setPrestataireToUpdate] = useState<Prestataire | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemPerPage = 7;

    const getAllPrestataires = useCallback(async () => {
        try {
            setStatus(FETCH_STATUS.LOADING);
            const response = await fetch(`${URLS.ServerIpAddress}/api/getPrestataires`, {
                method: 'GET',
                headers: { 'content-type': 'application/json' },
                credentials: 'include',
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw ({ status: result.status || response.status, message: result.message || "Failed to fetch" });
            }
            setPrestataires(result.data);
            setStatus(FETCH_STATUS.SUCCESS);
        } catch (error: any) {
            console.error("Error while getting the prestataires:", error.message);
            setStatus(FETCH_STATUS.ERROR);
            toast.error(`Erreur lors de la récupération des prestataires: ${error.message}`);
        }
    }, []);

    useEffect(() => {
        getAllPrestataires();
    }, [getAllPrestataires]);

    const deletePrestataires = async (ids: number[]) => {
        if (ids.length === 0) {
            toast.warning("Aucun prestataire sélectionné pour la suppression.");
            return;
        }
        try {
            const response = await fetch(`${URLS.ServerIpAddress}/api/deletePrestataire`, {
                method: "DELETE",
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ IDs: ids }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw ({ status: result.status || response.status, message: result.message || "Failed to delete" });
            }

            toast.success("Prestataires supprimés avec succès");
            setSelectedItems({});
            await getAllPrestataires();
        } catch (error: any) {
            console.error("Error while deleting prestataires:", error.message);
            toast.error(`Erreur lors de la suppression des prestataires: ${error.message}`);
        }
    };

    const handleDelete = async () => {
        const selectedPrestatairesIds: number[] = Object.keys(selectedItems)
            .filter(key => selectedItems[key])
            .map(key => parseInt(key));

        if (selectedPrestatairesIds.length > 0) {
            await deletePrestataires(selectedPrestatairesIds);
        } else {
            toast.warning("Aucun prestataire sélectionné.");
        }
    };

    const filteredPrestataires = prestataires.filter((item => {
        const term = searchTerm.toLowerCase();
        return (
            (item.nom && item.nom.toLowerCase().includes(term)) ||
            (item.email && item.email.toLowerCase().includes(term)) ||
            (item.type && item.type.toLowerCase().includes(term)) ||
            (item.num_tel && item.num_tel.toLowerCase().includes(term)) ||
            (item.address && item.address.toLowerCase().includes(term))
        );
    }));

    const totalPages = Math.max(1, Math.ceil(filteredPrestataires.length / itemPerPage));

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const indexOfLastItem = itemPerPage * currentPage;
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const shownPrestataires = filteredPrestataires.slice(indexOfFirstItem, indexOfLastItem);

    const allSelectedOnPage = shownPrestataires.length > 0 && shownPrestataires.every((item) => selectedItems[item.ID]);

    const handleSelectItem = (id: number, isSelected: boolean) => {
        setSelectedItems((prev) => ({
            ...prev,
            [id]: isSelected,
        }));
    };

    const handleSelectAllOnPage = (e: ChangeEvent<HTMLInputElement>) => {
        const isSelected = e.target.checked;
        const newSelectedItems: SelectedItems = { ...selectedItems };

        shownPrestataires.forEach((item) => {
            newSelectedItems[item.ID] = isSelected;
        });
        setSelectedItems(newSelectedItems);
    };

    const handleOpenUpdateModal = (prestataire: Prestataire) => {
        setPrestataireToUpdate(prestataire);
        setIsUpdateModalOpen(true);
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            pageNumbers.push(
                <button key={1} onClick={() => setCurrentPage(1)} className={currentPage === 1 ? 'active_page_button' : ''}>
                    1
                </button>
            );
            if (startPage > 2) {
                pageNumbers.push(<button key="start-ellipsis" disabled>...</button>);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button key={i} onClick={() => setCurrentPage(i)} className={currentPage === i ? 'active_page_button' : ''}>
                    {i}
                </button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pageNumbers.push(<button key="end-ellipsis" disabled>...</button>);
            }
            pageNumbers.push(
                <button key={totalPages} onClick={() => setCurrentPage(totalPages)} className={currentPage === totalPages ? 'active_page_button' : ''}>
                    {totalPages}
                </button>
            );
        }
        return pageNumbers;
    };

    return (
        <div className='prestataires_page'>
            <Sidebar />
            <div className='prestataires_page_container'>
                <div className='prestataires_page_container_header'>
                    <div className='prestataires_page_container_title'>Prestataires de Service</div>
                    <div className='prestataires_page_container_search'>
                        <Search className='prestataires_page_search_icon' size={20} />
                        <input
                            type="text"
                            placeholder='Rechercher par nom, email, service...'
                            className='prestataires_page_container_search_input'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className='prestataires_page_container_add_prestataires'>
                        <button
                            className='prestataires_page_container_add_prestataires_button'
                            onClick={() => setIsModalOpen(true)}
                        >
                            + Ajouter un prestataire
                        </button>
                    </div>
                </div>
                
                <table className='prestataires_page_container_table'>
                    <thead>
                        <tr>
                            <th className='prestataires_page_container_table_checkbox_header'>
                                <input
                                    type="checkbox"
                                    checked={allSelectedOnPage}
                                    onChange={handleSelectAllOnPage}
                                    disabled={shownPrestataires.length === 0}
                                />
                            </th>
                            <th data-label="Nom" className='prestataires_page_container_table_name_header'>Nom</th>
                            <th data-label="Type" className='prestataires_page_container_table_type_header'>Type</th>
                            <th data-label="Email" className='prestataires_page_container_table_email_header'>Email</th>
                            <th data-label="Téléphone" className='prestataires_page_container_table_phone_header'>Téléphone</th>
                            <th data-label="Adresse" className='prestataires_page_container_table_address_header'>Adresse</th>
                            <th data-label="Actions" className='prestataires_page_container_table_actions_header'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {status === FETCH_STATUS.LOADING && (
                            <tr>
                                <td colSpan={8} className="prestataires_page_table_message">Chargement des données...</td>
                            </tr>
                        )}
                        {status === FETCH_STATUS.ERROR && (
                            <tr>
                                <td colSpan={8} className="prestataires_page_table_message error">Erreur lors du chargement des données. Veuillez réessayer.</td>
                            </tr>
                        )}
                        {status === FETCH_STATUS.SUCCESS && filteredPrestataires.length === 0 && (
                            <tr>
                                <td colSpan={8} className="prestataires_page_table_message">
                                    {searchTerm ? `Aucun prestataire trouvé pour "${searchTerm}".` : "Aucun prestataire disponible."}
                                </td>
                            </tr>
                        )}
                        {status === FETCH_STATUS.SUCCESS && filteredPrestataires.length > 0 && (
                            <>
                                {shownPrestataires.map((item) => (
                                    <PrestataireElement
                                        key={item.ID}
                                        item={item}
                                        isSelected={!!selectedItems[item.ID]}
                                        onselect={handleSelectItem}
                                        setUpdate={handleOpenUpdateModal}
                                        setIsUpdateModalOpen={setIsUpdateModalOpen}
                                    />
                                ))}
                                {Array.from({ length: Math.max(0, itemPerPage - shownPrestataires.length) }).map((_, index) => (
                                    <tr key={`placeholder-${index}`} style={{ height: "57px" }}>
                                        <td colSpan={8}> </td>
                                    </tr>
                                ))}
                            </>
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={8}>
                                <div className='prestataires_page_table_footer_nav'>
                                    <div className='prestataires_page_table_footer_count'>
                                        Affichage de {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredPrestataires.length)} sur {filteredPrestataires.length}
                                    </div>
                                    <div className='prestataires_page_table_footer_nav_buttons'>
                                        <button
                                            className='prestataires_page_table_prev'
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            <img src={arrowBack} alt="Précédent" />
                                        </button>
                                        {renderPageNumbers()}
                                        <button
                                            className='prestataires_page_table_next'
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                            disabled={currentPage === totalPages}
                                        >
                                            <img src={arrowForward} alt="Suivant" />
                                        </button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <AddPrestataireModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                getPrestataires={getAllPrestataires}
            />

            {prestataireToUpdate && (
                <UpdatePrestataireModal
                    isOpen={isUpdateModalOpen}
                    onClose={() => {
                        setIsUpdateModalOpen(false);
                        setPrestataireToUpdate(null);
                    }}
                    getPrestataires={getAllPrestataires}
                    item={prestataireToUpdate}
                />
            )}

            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
}

export default Prestataires_page;