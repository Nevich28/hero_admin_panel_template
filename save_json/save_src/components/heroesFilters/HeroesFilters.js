import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';

import {useHttp} from '../../hooks/http.hook';
import { filtersFetching, filtersFetched, filtersFetchingError, setFilter } from '../../actions';
import Spinner from '../spinner/Spinner';
// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

const HeroesFilters = () => {
    const {filters, activeFilter, filtersLoadingStatus} = useSelector(state => state);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(filtersFetching());
        request("http://localhost:3001/filters")
            .then(data => dispatch(filtersFetched(data)))
            .catch(() => dispatch(filtersFetchingError()))

        // eslint-disable-next-line
    }, []);

    if (filtersLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const setActiveFilter = (activ) => {
        dispatch(setFilter(activ));
    }

    const renderFilterBtns = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Фильтров пока нет</h5>
        }

        const classArr = ['btn-outline-dark', 'btn-outline-danger', 'btn-outline-primary', 'btn-outline-success', 'btn-outline-secondary'];
        let count=-1
        return arr.map((item, i) => {
            count++
            if (count>=classArr.length) count=count-classArr.length;
            const activClass = Object.keys(item)[0] === activeFilter ? true : false ;
            const btnClass = classNames('btn', classArr[count], {active : activClass});
            return <button key={i} onClick={() => setActiveFilter(Object.keys(item)[0])} className={btnClass}>{Object.values(item)[0]}</button>
        })
    }

    const filterBtns = renderFilterBtns(filters);
    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">  
                    {filterBtns}
                    {/* <button className="btn btn-outline-dark active">Все</button>
                    <button className="btn btn-outline-danger">Огонь</button>
                    <button className="btn btn-outline-primary">Вода</button>
                    <button className="btn btn-outline-success">Ветер</button>
                    <button className="btn btn-outline-secondary">Земля</button> */}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;