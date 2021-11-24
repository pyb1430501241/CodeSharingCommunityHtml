import Vue from 'vue'
import Router from 'vue-router'
import Rogin from '../components/Rogin'
import Rogon from '../components/Rogon'
import ChangePassword from '../components/ChangePassword'
// import HelloWorld from '../views/HelloWorld'
import HelloWorld from '../views/HelloWorld'
import LoggingStatus from '../views/LoggingStatus'
import UserAgreement from '../components/UserAgreement'
import NotFound from '../components/NotFound'
import Content from '../components/Content'
import BlogEditor from "../components/BlogEditor"
import BlogArticle from "../components/BlogArticle"
import PersonalCenter from "../components/PersonalCenter"
import Author from '../components/Author'
import PostFile from '../components/PostFile'


const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error)
}

Vue.use(Router)

export default new Router({
    mode: 'hash',
    routes: [
        {
            path: '/',
            name: 'hHelloWorld',
            redirect: '/HelloWorld',
        },
        {
            path: '/HelloWorld',
            name: 'HelloWorld',
            component: HelloWorld,
            redirect: '/HelloWorld/Content',
            children: [
                // { path: '/', redirect: '/Rogon' },
                { path: 'Rogon', component: Rogon, name: 'Rogon' },
                { path: 'Rogin', component: Rogin, name: 'Rogin' },
                { path: 'ChangePassword', component: ChangePassword, name: 'ChangePassword' },
                { path: 'Content', component: Content, name: 'Content' },
                { path: 'UserAgreement', component: UserAgreement, name: 'UserAgreement' },
                { path: 'NotFound', component: NotFound, name: 'NotFound' },
                { path: "BlogArticle/:webid", component: BlogArticle, name: 'BlogArticle' },
                { path: "Author/:uid", component: Author, name: 'Author' },
            ]
        },
        {
            path: '/LoggingStatus',
            name: "LoggingStatus",
            component: LoggingStatus,
            redirect: '/LoggingStatus/PersonalCenter',
            children: [
                { path: "PersonalCenter", component: PersonalCenter, name: 'PersonalCenter' },
                { path: "Content", component: Content, name: 'lContent' },
                { path: 'UserAgreement', component: UserAgreement, name: 'lUserAgreement' },
                { path: 'NotFound', component: NotFound, name: 'lNotFound' },
                { path: "BlogEditor/:webid", component: BlogEditor, name: 'BlogEditor' },
                { path: "PostFile", component: PostFile, name: 'PostFile' },
                { path: "BlogArticle/:webid", component: BlogArticle, name: 'lBlogArticle' },
                { path: "Author/:uid", component: Author, name: 'lAuthor' },
            ]
        }
    ]
})