// constants
const BREAKING_POINTS = {
    _0_xs: 0,
    _1_sm: 576,
    _2_md: 768,
    _3_lg: 992,
    _4_xl: 1200,
    _5_xxl: 1400
};
// cards_per_slide (and cards_bp) must be a factor of 12 : {1, 2, 3, 4, 6, 12}.
const CARDS_BP = {
    _0_xs: 1,
    _1_sm: 2,
    _2_md: 3,
    _3_lg: 4,
    _4_xl: 4,
    _5_xxl: 4
};

// slides
function calc_cards_per_slide_value() {
    for (const bp of Object.keys(BREAKING_POINTS).reverse()) {
        if (BREAKING_POINTS[bp] <= window.innerWidth) {
            return CARDS_BP[bp];
        }
    }
}

function groups_nav(groups, selected_group, set_selected_group) {

    return (
        <ul class="nav nav-tabs container mb-3" rol="tablist">
            {
                groups.map(group =>
                    <li class="nav-item" id={group} role="presentation">
                        <button
                            class={"nav-link text-secondary" + (group === selected_group ? " active" : "")}
                            data-bs-toggle="tab" type="button"
                            aria-selected={group === selected_group ? "true" : "false"}
                            onClick={() => set_selected_group(group)}
                        >
                            {db[group].name}
                        </button>
                    </li>
                )
            }
        </ul>
    );
}

function gen_stars(rating) {

    let ret = [];
    const MAX_NUMBER_OF_STARS = 5;
    for (let i = 1; i <= MAX_NUMBER_OF_STARS; i++) {
        if (rating >= i) {
            ret.push(<i class="fa-solid fa-star"></i>);
        }
        else if (rating + 0.5 >= i) {
            ret.push(<i class="fa-solid fa-star-half-stroke"></i>);
        }
        else {
            ret.push(<i class="fa-regular fa-star"></i>);
        }
    }
    return ret;
}

function gen_group_info(group_name) {

    const group = db[group_name];

    return (
        <>
            <h2 class="course_title">{group.header}</h2>
            <p class="course_desc">{group.description}</p>
            <button class="explore">{"Explore " + group.name}</button>
        </>
    )
}

function gen_course_card(course, cards_per_slide){
    return (
        <div class={`col-${12 / cards_per_slide}`}>
            <figure>
                <img class="d-block w-100" src={course.image} alt={course.title}></img>
                <figcaption>{course.title}</figcaption>
            </figure>
            {
                course.instructors.map(instructor =>
                    <h4 class="author">{instructor.name}</h4>
                )
            }
            <div class="stars">
                {gen_stars(course.rating)}
            </div>
            <h3 class="price">${course.price}</h3>
        </div>
    )
}

function gen_slides(group_name, filter_string, cards_per_slide) {

    const group = db[group_name];
    const courses = group.courses.filter(course => course.title.toLowerCase().includes(filter_string));

    let slides = [];
    courses.forEach((course, idx) => {
        if (idx % cards_per_slide == 0) {
            slides.push([]);
        }
        slides[slides.length - 1].push(course);
    }); 

    return slides.map((slide, idx) => (
        <div class={`carousel-item ${idx === 0 ? "active" : ""}`}>
            <div class="row">
                {slide.map(course => gen_course_card(course, cards_per_slide))}
            </div>
        </div> 
    ))
}

function _app_courses(){

    const groups = Object.keys(db);
    const [selected_group, set_selected_group] = React.useState(groups[0]);
    const [filter_string, set_filter_string] = React.useState('');
    const [cards_per_slide, set_cards_per_slide] = React.useState(calc_cards_per_slide_value());

    React.useEffect(() => {

        document.getElementById("search_submit_btn").addEventListener("click", (e) => {
            e.preventDefault();
            const filter_s = document.getElementById("search_bar_input").value.trim().toLowerCase();
            set_filter_string(filter_s);
            document.getElementById("courses_list").scrollIntoView({ behavior: "smooth", block: "start" });
        });
    
        document.getElementById("search_bar_input").addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                document.getElementById("search_submit_btn").click();
            }
        })
    
        window.addEventListener("resize", (e) => {
            set_cards_per_slide(calc_cards_per_slide_value());
        });

    }, []);
    
    return (
        <>
            <div id="groups_nav">
                {groups_nav(groups, selected_group, set_selected_group)}
            </div>

            <section class="container mb-4">
                <div id="selected_group" class="selected_group">

                    <div id="group_info">
                        {gen_group_info(selected_group)}
                    </div>

                    <div id="courses_list" class="carousel slide carousel-multi-item courses_list" data-bs-ride="carousel">

                        <div id="courses_list_inner" class="carousel-inner" role="listbox">
                            {gen_slides(selected_group, filter_string, cards_per_slide)}
                        </div>

                        <button class="carousel-control-prev darken w-10" type="button" data-bs-target="#courses_list"
                            data-bs-slide="prev">
                            <span class="w-25 h-25 carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next darken w-10" type="button" data-bs-target="#courses_list"
                            data-bs-slide="next">
                            <span class="w-25 h-25 carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
            </section>
        </>
    )
}

// top categories
function gen_category(category) {
    return (
        <div class="col">
            <img class="d-block w-75 m-auto" src={category.img} alt={category.name}></img>
            <h3 class="fs-6 fw-bold">{category.name}</h3>
        </div>
    )
}
function _app_categories(){
    return Object.keys(top_categories).map(category => gen_category(top_categories[category]));
}

ReactDOM.render(<_app_courses />, document.getElementById("app_courses"));
ReactDOM.render(<_app_categories />, document.getElementById("top_categories_grid"));
