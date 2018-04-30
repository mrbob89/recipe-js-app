import axios from 'axios';
import { PROXY, API_KEY } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const result = await axios
                .get(
                    `${PROXY}http://food2fork.com/api/get?key=${API_KEY}&rId=${
                        this.id
                    }`
                )
                .then(res => res.data.recipe);

            this.title = result.title;
            this.author = result.publisher;
            this.img = result.image_url;
            this.url = result.source_url;
            this.ingredients = result.ingredients;
        } catch (err) {
            console.log(err);
        }
    }

    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);

        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = [
            'tablespoons',
            'tablespoon',
            'ounces',
            'ounce',
            'teaspoons',
            'teaspoon',
            'cups',
            'pounds'
        ];
        const unitsShort = [
            'tbsp',
            'tbsp',
            'oz',
            'oz',
            'tsp',
            'tsp',
            'cup',
            'pound'
        ];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(item => {
            let ingredient = item.toLowerCase();

            // Uniform units
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // Remove parantheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, '');

            // Parse ingredient into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el => units.includes(el));

            let objIngredient;
            if (unitIndex > -1) {
                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIngredient = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };
            } else if (parseInt(arrIng[0], 10)) {
                objIngredient = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                };
            } else if (unitIndex === -1) {
                objIngredient = {
                    count: 1,
                    unit: '',
                    ingredient
                };
            }

            return objIngredient;
        });

        this.ingredients = newIngredients;
    }

    updateServings(type) {
        // Servings
        const newServings =
            type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}
