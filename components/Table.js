import Link from 'next/link';
import styles from '@/styles/home/home.module.scss';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import EditPannel from '@/components/EditPannel';
import { deleteBoardById, getBoardList, postBoard } from '@/data/boardApi';

const dataKeyAndValue = {
    title: '제목',
    date: '날짜',
    link: '링크',
    tags: '태그',
    status: '상태',
    createdAt: '작성 날짜',
    creatorName: '작성자',
    updatedAt: '갱신 날짜',
    updatorName: '갱신자',
    note: '비고',
};

const dropdownMenuDefault = {
    title: null,
    date: null,
    link: null,
    tags: null,
    status: null,
    createdAt: null,
    creatorName: null,
    updatedAt: null,
    updatorName: null,
    note: null,
};

const growthTypes = ['store', 'til', 'toy'];
const aboutMeTypes = ['think', 'favorite'];

const Table = ({ tableType }) => {
    const selectTypes = tableType === 'growth' ? ['STORE', 'TIL', 'TOY'] : ['think', 'favorite'];
    const [dataList, setDataList] = useState([]); //all data list
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [clickedItemInfo, setClickedItemInfo] = useState(null);
    const [openAddSortMenuModal, setOpenAddSortMenuModal] = useState(false);
    const [openAddFilterMenuModal, setOpenAddFilterMenuModal] = useState(false);

    const [selectedSortMenus, setSelectedSortMenus] = useState(
        new Map(Object.entries(dropdownMenuDefault)),
    );
    const [selectedFilterMenus, setSelectedFilterMenus] = useState(
        new Map(Object.entries(dropdownMenuDefault)),
    );

    const [dataTableName, setdtn] = useState(Object.entries(dataKeyAndValue));

    const setDataListByTableType = useCallback(
        (newData) => {
            switch (tableType) {
                case 'growth': {
                    setDataList(newData?.filter((_data) => growthTypes.includes(_data.type)) || []);
                    break;
                }
                case 'aboutme': {
                    setDataList(
                        newData?.filter((_data) => aboutMeTypes.includes(_data.type)) || [],
                    );
                    break;
                }
            }
        },
        [tableType],
    );

    useEffect(() => {
        getBoardList().then((res) => {
            setDataListByTableType(res);
        });
    }, [setDataListByTableType]);

    return (
        <>
            <div id={styles.boardTable}>
                {tableType === 'growth' ? (
                    <div className={styles.title}>My Growth</div>
                ) : (
                    <div className={styles.title}>About Me</div>
                )}
                {/* <div className={styles.description}>나는 개발자로서 어떻게 성장하고 있는거니</div> */}
                <div className={styles.types}>
                    {selectTypes.map((e, i) => {
                        return (
                            <div key={`${e}-${i}`} className="">
                                <span>{e}</span>
                            </div>
                        );
                    })}
                </div>
                <div className={styles.graphHandler}>
                    <div className={styles.sort}>
                        <div>
                            <span>sort</span>
                        </div>
                        {Array.from(selectedSortMenus.keys()).map((_menu) => {
                            if (selectedSortMenus.get(_menu) === null)
                                return <Fragment key={'sort menu' + _menu} />;
                            return <div key={'sort menu' + _menu}>{dataKeyAndValue[_menu]}</div>;
                        })}
                        <div
                            onClick={() => {
                                setOpenAddSortMenuModal((old) => !old);
                            }}
                        >
                            <span className={styles.addButton}>+ 정렬 추가</span>
                        </div>
                        {openAddSortMenuModal && (
                            <div className={styles.addMenuModal}>
                                <div onClick={() => setOpenAddSortMenuModal(false)}>x</div>

                                {Object.entries(dataKeyAndValue).map((_data) => {
                                    const [_key, _value] = _data;

                                    return (
                                        <div
                                            key={`sort-drowdown-menu-${_key}`}
                                            className={styles.item}
                                            onClick={(e) => {
                                                setSelectedSortMenus((old) => {
                                                    old.set(_key, true);
                                                    return old;
                                                });

                                                // todo sort
                                            }}
                                        >
                                            {_value}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <div className={styles.filter}>
                        <div>
                            <span>filter</span>
                        </div>
                        {Array.from(selectedFilterMenus.keys()).map((_menu) => {
                            if (selectedFilterMenus.get(_menu) === null)
                                return <Fragment key={'filter menu' + _menu} />;
                            return <div key={'filter menu' + _menu}>{dataKeyAndValue[_menu]}</div>;
                        })}
                        <div
                            onClick={() => {
                                setOpenAddFilterMenuModal((old) => !old);
                            }}
                        >
                            <span className={styles.addButton}>+ 필터 추가</span>
                        </div>
                        {openAddFilterMenuModal && (
                            <div className={styles.addMenuModal}>
                                <div onClick={() => setOpenAddFilterMenuModal(false)}>x</div>

                                {Object.entries(dataKeyAndValue).map((_data) => {
                                    const [_key, _value] = _data;
                                    return (
                                        <div
                                            key={`filter-dropdown-menu-${_key}`}
                                            className={styles.item}
                                            onClick={() => {
                                                setSelectedFilterMenus((old) => {
                                                    old.set(_key, { isSelected: true, value: '' });
                                                    return old;
                                                });
                                            }}
                                        >
                                            {_value}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.graphBox}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <td></td>
                                {dataTableName.map((tr) => {
                                    return <td key={`table-head-${tr[1]}`}>{tr[1]}</td>;
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {dataList.map((growthInfo, listIdx) => {
                                return (
                                    <tr key={`grow-info-${growthInfo.id}`}>
                                        <td
                                            onClick={async () => {
                                                await deleteBoardById(growthInfo.id);
                                                const newData = await getBoardList();
                                                setDataListByTableType(newData);
                                            }}
                                        >
                                            X
                                        </td>
                                        {dataTableName.map((tr, tdIdx) => {
                                            return (
                                                <td
                                                    key={`table-head-${tr[1]}-${tdIdx}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (tr[0] === 'title') {
                                                            setClickedItemInfo({
                                                                index: listIdx,
                                                            });
                                                            setIsOpenEditModal(true);
                                                        }
                                                    }}
                                                >
                                                    {growthInfo[tr[0]] ?? ''}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div
                        className={styles.addListButton}
                        onClick={async () => {
                            const defaultType = tableType === 'growth' ? 'store' : 'think';
                            await postBoard({ type: defaultType });
                            const newData = await getBoardList();
                            setDataListByTableType(newData);
                        }}
                    >
                        <span>+ 새로 만들기</span>
                    </div>
                </div>
            </div>
            {isOpenEditModal && clickedItemInfo && (
                <EditPannel
                    list={dataList}
                    setList={setDataList}
                    listIndex={clickedItemInfo.index}
                    onClose={(info) => {
                        setClickedItemInfo(null);
                        setIsOpenEditModal(false);
                    }}
                />
            )}
        </>
    );
};

export default Table;
