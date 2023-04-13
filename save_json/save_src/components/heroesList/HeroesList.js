import {useHttp} from '../../hooks/http.hook';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { heroesFetching, heroesFetched, heroesFetchingError } from '../../actions';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';
import './heroesList.scss'

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {
    const {heroes, heroesLoadingStatus, activeFilter} = useSelector(state => state);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(heroesFetching());
        request("http://localhost:3001/heroes")
            .then(data => dispatch(heroesFetched(data)))
            .catch(() => dispatch(heroesFetchingError()))

        // eslint-disable-next-line
    }, []);

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }

        if (activeFilter === 'all') {
            return arr.map(({id, ...props}) => {
                return (
                    <CSSTransition
                    in={true}
                    key={id}
                    // nodeRef={nodeRef}
                    timeout={500}
                    classNames="item"
                    >
                        <HeroesListItem key={id} id={id} {...props}/>
                    </CSSTransition>    
                )
            })
         } else {
            return arr.map(({id, element, ...props}) => {
                if (activeFilter === element) {
                    return (
                        <CSSTransition
                        in={true}
                        key={id}
                        // nodeRef={nodeRef}
                        timeout={500}
                        classNames="item"
                        >
                            <HeroesListItem key={id} id={id} element={element} {...props}/>
                        </CSSTransition>
                    )
                } else {
                    return null
                }
            })
        }
    }

    const elements = renderHeroesList(heroes);
    return (
        <ul>
            <TransitionGroup component="ul">        
                {elements}
            </TransitionGroup>
        </ul>
    )
}

export default HeroesList;