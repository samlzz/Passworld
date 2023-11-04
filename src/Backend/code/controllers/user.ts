import { User } from '../models/model_user.js';

export const checkIdAndCreate = (req, res) => {
    const { mdp, id } = req.body;
    User.findOne({ email: id })
        .then((user) => {
            if (user) {
                res.status(409).json({ msg: 'Username already exists' });
            } else {
                const addUser = new User({
                    email: id,
                    motDePasse: mdp,
                });
                addUser
                    .save()
                    .then(() =>
                        res.status(201).json({ msg: 'User was created' })
                    )
                    .catch((err) => res.status(500).json(err));
            }
        })
        .catch((err) => res.status(500).json(err));
};
