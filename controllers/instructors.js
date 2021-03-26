var fs = require("fs");
var data = require("../data.json");


// Index
exports.index = function(req, res) {
    return res.render("instructors/index", { instructors: data.instructors });
};


// Show instructor
exports.show = function(req, res){
    // req.params = pegar o parâmetro da rota
    var { id } = req.params;

    var foundInstructor = data.instructors.find(function(instructor){
        return instructor.id == id;
    });

    if (!foundInstructor) return res.send("Instrutor não existe!");

    function age(timestamp) {
        var today = new Date();
        var birthDate = new Date(timestamp);
    
        var age = today.getFullYear() - birthDate.getFullYear();
        var month = today.getMonth() - birthDate.getMonth();
    
        if (month < 0 || month == 0 && today.getDate() < birthDate.getDate()) {
            age = age - 1;
        };
    
        return age;
    };

    var instructor = {
        ...foundInstructor,
        age: age(foundInstructor.birth),
        services: foundInstructor.services.split(","),
        created_at: new Intl.DateTimeFormat("pt-BR").format(foundInstructor.created_at)
    };

    return res.render("instructors/show", { instructor });
};


// Create new instructor
exports.post = function(req, res){
    var keys = Object.keys(req.body);

    for (key of keys) {
        if (req.body[key] == "") {
            return res.send("Preencha todos os campos!");
        }
    }

    // pegando apenas o que desejo do front-end (req.body)
    let { avatar_url, birth, gender, services, name } = req.body

    birth = Date.parse(birth);
    var created_at = Date.now();
    var id = Number(data.instructors.length + 1);

    data.instructors.push({
        id,
        name,
        avatar_url,
        birth,
        gender,
        services,
        created_at
    });
    
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if (err) return res.send("Não foi possível concluir o cadastro.");

        return res.redirect("/instructors");
    });
};


// Edit instructor
exports.edit = function(req, res){
    var { id } = req.params;

    var foundInstructor = data.instructors.find(function(instructor){
        return instructor.id == id;
    });

    if (!foundInstructor) return res.send("Instrutor não existe!");

    return res.render("instructors/edit", { instructor: foundInstructor });
};


// Update instructor
exports.put = function(req, res){
    var { id } = req.body;
    let index = 0

    var foundInstructor = data.instructors.find(function(instructor, foundIndex){
        if (id == instructor.id) {
            index = foundIndex;
            return true;
        }
    });

    if (!foundInstructor) return res.send("Instrutor não existe!");

    var instructor = {
        ...foundInstructor,
        ...req.body,
        id: Number(req.body.id)
    };

    data.instructors[index] = instructor;

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send("Erro na ação");

        return res.redirect(`/instructors/${id}`);
    });
};


// Delete instructor
exports.delete = function(req, res) {
    var { id } = req.body;

    var filteredInstructors = data.instructors.filter(function(instructor) {
        return instructor.id != id;
    });

    data.instructors = filteredInstructors;

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send("Erro na ação");

        return res.redirect("/instructors");
    });
};