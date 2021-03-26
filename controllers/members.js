var fs = require("fs");
var data = require("../data.json");


// Index
exports.index = function(req, res) {
    return res.render("members/index", { members: data.members });
};


// Show member
exports.show = function(req, res){
    // req.params = pegar o parâmetro da rota
    var { id } = req.params;

    var foundMember = data.members.find(function(member){
        return member.id == id;
    });

    if (!foundMember) return res.send("Instrutor não existe!");

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

    var member = {
        ...foundMember,
        age: age(foundMember.birth),
        modalidades: foundMember.modalidades.split(","),
        created_at: new Intl.DateTimeFormat("pt-BR").format(foundMember.created_at)
    };

    return res.render("members/show", { member });
};


// Page create member
exports.create = function(req, res) {
    return res.render("members/create");
};


// Create new member
exports.post = function(req, res){
    var keys = Object.keys(req.body);

    for (key of keys) {
        if (req.body[key] == "") {
            return res.send("Preencha todos os campos!");
        }
    }

    // pegando apenas o que desejo do front-end (req.body)
    let { avatar_url, birth, gender, mail, name, modalidades } = req.body

    birth = Date.parse(birth);
    var created_at = Date.now();
    let id = 1;
    var lastMember = data.members[data.members.length - 1];

    if (lastMember) {
        id = lastMember.id + 1;
    };

    data.members.push({
        id,
        name,
        mail,
        avatar_url,
        birth,
        gender,
        modalidades,
        created_at
    });
    
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if (err) return res.send("Não foi possível concluir o cadastro.");

        return res.redirect("/members");
    });
};


// Edit member
exports.edit = function(req, res){
    var { id } = req.params;

    var foundMember = data.members.find(function(member){
        return member.id == id;
    });

    if (!foundMember) return res.send("Instrutor não existe!");

    return res.render("members/edit", { member: foundMember });
};


// Update member
exports.put = function(req, res){
    var { id } = req.body;
    let index = 0

    var foundMember = data.members.find(function(member, foundIndex){
        if (id == member.id) {
            index = foundIndex;
            return true;
        }
    });

    if (!foundMember) return res.send("Instrutor não existe!");

    var member = {
        ...foundMember,
        ...req.body,
        id: Number(req.body.id)
    };

    data.members[index] = member;

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send("Erro na ação");

        return res.redirect(`/members/${id}`);
    });
};


// Delete member
exports.delete = function(req, res) {
    var { id } = req.body;

    var filteredMembers = data.members.filter(function(member) {
        return member.id != id;
    });

    data.members = filteredMembers;

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send("Erro na ação");

        return res.redirect("/members");
    });
};