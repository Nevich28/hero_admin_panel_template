import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { heroesAdd, heroesFetching, heroesFetchingError } from '../../actions';
import {useHttp} from '../../hooks/http.hook';

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {
    const dispatch = useDispatch();
    const {request} = useHttp();
    const {filters} = useSelector(state => state);

    const createNewHeroe = (data) => {
        data = Object.assign({id : uuidv4()}, data)
        dispatch(heroesFetching());
        
        request("http://localhost:3001/heroes", 'POST', JSON.stringify(data))
            .then(data => dispatch(heroesAdd(data)))
            .catch(() => dispatch(heroesFetchingError()))
    }

    const createOptions = (arr) => {
        const withoutAll = arr.filter(item => Object.keys(item)[0] !== 'all')
        return withoutAll.map((item, i) => {
                return <option key={i} value={Object.keys(item)[0]}>{Object.values(item)[0]}</option>
            }
            
        )
    }

    return (
        <Formik
            initialValues = {{
                name: '',
                description: '',
                element: ''                
            }}
            validationSchema = {Yup.object({
                name: Yup.string()
                        .min(4, 'Минимум 2 символа!')
                        .required('Обязательное поле!'),
                description: Yup.string()
                        .min(10, 'Не менее 10 символов!')
                        .required('Обязательное поле!'),
                element: Yup.string().required('Выберите элемент героя!')        
            })}
            onSubmit = {(data, {resetForm} )=> {
                        createNewHeroe(data)
                        resetForm()
                        }} >
            <Form className="border p-4 shadow-lg rounded">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                    <Field 
                        name="name" 
                        className="form-control" 
                        placeholder="Как меня зовут?"/>
                        <ErrorMessage name="name" component="div"/>
                </div>

                <div className="mb-3">
                    <label htmlFor="text" className="form-label fs-4">Описание</label>
                    <Field
                        as="textarea"
                        name="description" 
                        className="form-control" 
                        placeholder="Что я умею?"
                        style={{"height": '130px'}}/>
                        <ErrorMessage name="text" component="div"/>

                </div>

                <div className="mb-3">
                    <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                    <Field 
                        as="select"
                        className="form-select" 
                        name="element">
                        <option >Я владею элементом...</option>
                        {createOptions(filters)}
                        {/* <option value="fire">Огонь</option>
                        <option value="water">Вода</option>
                        <option value="wind">Ветер</option>
                        <option value="earth">Земля</option> */}
                    </Field>
                    <ErrorMessage name="element" component="div"/>
                </div>

                <button type="submit" className="btn btn-primary">Создать</button>
            </Form>
        </Formik>
    )
}

export default HeroesAddForm;