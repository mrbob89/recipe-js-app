import axios from 'axios';
import { PROXY, API_KEY } from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
            this.result = await axios
                .get(
                    `${PROXY}http://food2fork.com/api/search?key=${API_KEY}&q=${
                        this.query
                    }`
                )
                .then(res => res.data.recipes);
        } catch (err) {
            alert(err);
        }
    }
}
