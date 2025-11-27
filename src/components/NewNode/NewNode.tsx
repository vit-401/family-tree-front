import React, {useState} from "react";
import {DataTreeResponseType, WithChildrenType} from "../../api/treeData/type";
import style from "./Node.module.css"
import {useNavigate} from "react-router-dom";
import {EditOutlined, PlusCircleOutlined, ArrowUpOutlined, HeartOutlined} from "@ant-design/icons";
import {useAppDispatch} from "../../hooks/reducer";
import {Tooltip} from "antd";
import {useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {InitialStateTreeType} from "../../reducers/treeReducer";
import {EditPersonModal} from "./EditPersonModal";
import {AddChildModal} from "./AddChildModal";
import {AddParentModal} from "./AddParentModal";
import {AddSpouseModal} from "./AddSpouseModal";

type NodeComponentPropsType = {
    children?: React.ReactNode
    node?: WithChildrenType<DataTreeResponseType>[]
    renderedSpouseIds?: Set<string>
}
export const dumbUserURI = "data:image/png;base64,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"

export function NewNode(props?: NodeComponentPropsType): JSX.Element {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {dataState} = useSelector<AppRootStateType, InitialStateTreeType>(state => state.tree);
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingNode, setEditingNode] = useState<DataTreeResponseType | null>(null);
    
    const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
    const [parentNodeForChild, setParentNodeForChild] = useState<DataTreeResponseType | null>(null);
    
    const [isAddParentModalOpen, setIsAddParentModalOpen] = useState(false);
    const [childNodeForParent, setChildNodeForParent] = useState<DataTreeResponseType | null>(null);
    
    const [isAddSpouseModalOpen, setIsAddSpouseModalOpen] = useState(false);
    const [personNodeForSpouse, setPersonNodeForSpouse] = useState<DataTreeResponseType | null>(null);

    const handleToggle = (node: DataTreeResponseType, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        // if (node.sex === 'male') {
        //     // Navigate to clean tree view for male nodes
        //     navigate(`/tree/${node._id}`);
        // } else {
        //     // Toggle expansion for female/other nodes
        //     dispatch(toggleNodeAC(node._id));
        // }
    };

    const handleEditClick = (node: DataTreeResponseType, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setEditingNode(node);
        setIsEditModalOpen(true);
    };

    const handleAddChildClick = (node: DataTreeResponseType, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setParentNodeForChild(node);
        setIsAddChildModalOpen(true);
    };

    const handleAddParentClick = (node: DataTreeResponseType, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setChildNodeForParent(node);
        setIsAddParentModalOpen(true);
    };

    const handleAddSpouseClick = (node: DataTreeResponseType, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setPersonNodeForSpouse(node);
        setIsAddSpouseModalOpen(true);
    };

    const scrollToNode = (id: string) => {
        const liElement = document.getElementById(id);
        const container = document.getElementById('body');
        
        if (liElement) {
            // Target the specific card image wrapper to center on, not the whole LI which might include children
            // We try to find the .member-image class which is the visible card
            const targetElement = liElement.querySelector(`.${style["member-image"]}`) as HTMLElement || liElement;

            if (container) {
                // Calculate precise position relative to the container
                const elementRect = targetElement.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();

                const relativeTop = elementRect.top - containerRect.top + container.scrollTop;
                const relativeLeft = elementRect.left - containerRect.left + container.scrollLeft;

                const scrollTop = relativeTop - (container.clientHeight / 2) + (elementRect.height / 2);
                const scrollLeft = relativeLeft - (container.clientWidth / 2) + (elementRect.width / 2);

                container.scrollTo({
                    top: scrollTop,
                    left: scrollLeft,
                    behavior: 'smooth'
                });
            } else {
                 // Fallback
                targetElement.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
            }
            
            // Add highlight effect to the specific card
            const originalBoxShadow = targetElement.style.boxShadow;
            const originalTransition = targetElement.style.transition;
            const originalTransform = targetElement.style.transform;
            
            targetElement.style.transition = "all 0.5s ease";
            targetElement.style.boxShadow = "0 0 0 4px rgba(24, 144, 255, 0.4), 0 0 20px rgba(24, 144, 255, 0.2)";
            targetElement.style.transform = "scale(1.05)";
            
            setTimeout(() => {
                targetElement.style.boxShadow = originalBoxShadow;
                targetElement.style.transform = originalTransform;
                setTimeout(() => {
                     targetElement.style.transition = originalTransition;
                }, 500);
            }, 1500);
        }
    };

    const handleParentClick = (parent: DataTreeResponseType, e: React.MouseEvent) => {
        e.stopPropagation();

        if (parent.sex === 'male') {
            navigate(`/tree/${parent._id}`);
            return;
        }

        // Check if parent is currently in the DOM (rendered in tree)
        const element = document.getElementById(parent._id);

        if (element) {
            // If present, scroll to it (typically mother in main tree)
            scrollToNode(parent._id);
        } else {
            // If not present (typically father/spouse not in main tree), open their tree view
            navigate(`/tree/${parent._id}`);
        }
    };

    const renderParentsDirectly = (parentId: string | null, isInCouple: boolean = false) => {
        if (!parentId) return null;
        
        const parent1 = dataState.find(p => p._id === parentId);
        if (!parent1) return null;

        const parent2 = parent1.spouseId ? dataState.find(p => p._id === parent1.spouseId) : null;

        // Helper to get role label
        const getRoleLabel = (p: DataTreeResponseType) => {
            if (p.parentType === 'step') return 'Step';
            if (p.parentType === 'adopted') return 'Adopted';
            return 'Parent';
        };

        const renderParentNode = (p: DataTreeResponseType) => {
            const isInTree = !!document.getElementById(p._id);
            const actionLabel = isInTree ? "Scroll to node" : "Open tree view";
            
            return (
                <div 
                    key={p._id}
                    style={{
                        flex: 1,
                        background: '#f8fafc',
                        borderRadius: isInCouple ? '6px' : '8px',
                        padding: isInCouple ? '4px 2px' : '6px 4px',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                        minWidth: 0
                    }}
                    onClick={(e) => handleParentClick(p, e)}
                    title={actionLabel}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#818cf8';
                        e.currentTarget.style.background = '#fff';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.background = '#f8fafc';
                    }}
                >
                    <img 
                        src={dumbUserURI} 
                        alt={p.firstName}
                        style={{
                            width: isInCouple ? 22 : 28, 
                            height: isInCouple ? 22 : 28, 
                            borderRadius: '50%', 
                            marginBottom: isInCouple ? 2 : 4,
                            objectFit: 'cover',
                            border: '1px solid #cbd5e1'
                        }} 
                    />
                    <Tooltip title={`${p.firstName} ${p.lastName}`}>
                        <div style={{fontSize: isInCouple ? '8px' : '10px', fontWeight: 600, color: '#334155', lineHeight: 1.1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%', minWidth: 0}}>
                            {p.firstName} {p.lastName}
                        </div>
                    </Tooltip>
                </div>
            );
        };

        return (
            <div style={{
                display: 'flex', 
                gap: isInCouple ? 3 : 5, 
                width: '100%', 
                marginBottom: isInCouple ? 8 : 12,
                zIndex: 5
            }} onClick={e => e.stopPropagation()}>
                {renderParentNode(parent1)}
                {parent2 && renderParentNode(parent2)}
            </div>
        );
    };

    // Track which nodes we've already rendered as spouses
    // Use the passed-in Set or create a new one for root level
    const renderedSpouseIds = props?.renderedSpouseIds || new Set<string>();

    return <>
        {props?.node?.map(node => {
            // Skip if this node was already rendered as someone's spouse
            if (renderedSpouseIds.has(node._id)) {
                return null;
            }

            // Check if this node has a spouse
            const spouse = node.spouseId ? dataState.find(p => p._id === node.spouseId) : null;
            // Find spouse in the tree structure to get their children
            const spouseInTree = spouse ? props?.node?.find(n => n._id === spouse._id) : null;
            
            if (spouse) {
                renderedSpouseIds.add(spouse._id);
            }

            // Check if this node already has 2 parents
            const parent1 = node.parentId ? dataState.find(p => p._id === node.parentId) : null;
            const parent2 = parent1?.spouseId ? dataState.find(p => p._id === parent1.spouseId) : null;
            const hasTwoParents = parent1 && parent2;

            // Merge children from both node and spouse
            const allChildren = [...node.children];
            if (spouseInTree && spouseInTree.children) {
                // Add spouse's children that aren't already in the list
                spouseInTree.children.forEach(spouseChild => {
                    if (!allChildren.find(c => c._id === spouseChild._id)) {
                        allChildren.push(spouseChild);
                    }
                });
            }

            // Show children if either parent is open
            const shouldShowChildren = node.isOpen || (spouseInTree?.isOpen ?? false);

            return <li key={node._id + ""} id={node._id}>
                
                    <a className={style["member-view-box"]} onClick={(e) => handleToggle(node, e)} style={{ cursor: "default" }}>
                        <div className={spouse ? style["member-image-couple"] : style["member-image"]}>
                            <div className={style["edit-icon"]}>
                                <Tooltip title="Edit Person">
                                    <span onClick={(e) => handleEditClick(node, e)} style={{ cursor: 'pointer' }}>
                                        <EditOutlined />
                                    </span>
                                </Tooltip>
                                <Tooltip title="Add Child">
                                    <span onClick={(e) => handleAddChildClick(node, e)} style={{ cursor: 'pointer' }}>
                                        <PlusCircleOutlined />
                                    </span>
                                </Tooltip>
                                <Tooltip title={hasTwoParents ? "Already has 2 parents" : "Add Parent"}>
                                    <span 
                                        onClick={(e) => hasTwoParents ? e.stopPropagation() : handleAddParentClick(node, e)} 
                                        style={{ 
                                            cursor: hasTwoParents ? 'not-allowed' : 'pointer',
                                            opacity: hasTwoParents ? 0.4 : 1
                                        }}
                                    >
                                        <ArrowUpOutlined />
                                    </span>
                                </Tooltip>
                                <Tooltip title={node.spouseId ? "Spouse already exists" : "Add Spouse"}>
                                    <span 
                                        onClick={(e) => node.spouseId ? e.stopPropagation() : handleAddSpouseClick(node, e)} 
                                        style={{ 
                                            cursor: node.spouseId ? 'not-allowed' : 'pointer',
                                            opacity: node.spouseId ? 0.4 : 1
                                        }}
                                    >
                                        <HeartOutlined />
                                    </span>
                                </Tooltip>
                            </div>
                            
                            {spouse ? (
                                // Render couple side-by-side
                                <div className={style["couple-container"]}>
                                    <div className={style["person-in-couple"]}>
                                        {renderParentsDirectly(node.parentId, true)}
                                        <img src={dumbUserURI} alt="Member"/>
                                        <div className={style["member-details"]}>
                                            <Tooltip title={`${node.firstName} ${node.lastName}`}>
                                                <h3>{node.firstName} {node.lastName}</h3>
                                            </Tooltip>
                                        </div>
                                    </div>
                                    <div className={style["spouse-divider"]}>
                                        <HeartOutlined style={{ fontSize: '16px', color: '#ef4444' }} />
                                    </div>
                                    <div className={style["person-in-couple"]}>
                                        <div className={style["spouse-badge"]}>Spouse</div>
                                        <img src={dumbUserURI} alt="Spouse"/>
                                        <div className={style["member-details"]}>
                                            <Tooltip title={`${spouse.firstName} ${spouse.lastName}`}>
                                                <h3>{spouse.firstName} {spouse.lastName}</h3>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Render single person
                                <>
                                    {renderParentsDirectly(node.parentId, false)}
                                    <img src={dumbUserURI} alt="Member"/>
                                    <div className={style["member-details"]}>
                                        <Tooltip title={`${node.firstName} ${node.lastName}`}>
                                            <h3>{node.firstName} {node.lastName}</h3>
                                        </Tooltip>
                                    </div>
                                </>
                            )}
                        </div>
                    </a>
                
                {shouldShowChildren && allChildren.length ? (<ul><NewNode node={allChildren} renderedSpouseIds={renderedSpouseIds}/></ul>) : null}

            </li>
        })}

        <EditPersonModal
            visible={isEditModalOpen}
            node={editingNode}
            onClose={() => {
                setIsEditModalOpen(false);
                setEditingNode(null);
            }}
        />

        <AddChildModal
            visible={isAddChildModalOpen}
            parentNode={parentNodeForChild}
            onClose={() => {
                setIsAddChildModalOpen(false);
                setParentNodeForChild(null);
            }}
        />

        <AddParentModal
            visible={isAddParentModalOpen}
            childNode={childNodeForParent}
            onClose={() => {
                setIsAddParentModalOpen(false);
                setChildNodeForParent(null);
            }}
        />

        <AddSpouseModal
            visible={isAddSpouseModalOpen}
            personNode={personNodeForSpouse}
            onClose={() => {
                setIsAddSpouseModalOpen(false);
                setPersonNodeForSpouse(null);
            }}
        />
    </>
}
