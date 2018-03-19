'use strict';

/**
 * Creates instance of UserStorage
 * 
 * @class
 * @classdesc User holder. Provide access to user data.
 */
class UserStorage {
	/**
	 * Creates instance of UserStorage
	 */
	constructor() {
		this.reset();
	}

	/**
	 * Fills user with incoming data and sets status to online.
	 * 
	 * @param {Object} data User data.
	 */
	fill(data) {
		this.avatar = data.avatar;
		this.nickname = data.nickname;
		this.email = data.email;
		this.rating = data.rating;
		this.games = data.countGames;
		this.wins = data.countWins;
		this._loggedIn = true;
	}

	/**
	 * Set data to null and loggedIn value into false.
	 */
	reset() {
		this.avatar = null;
		this.nickname =null;
		this.email = null;
		this.rating = null;
		this.gamesCount = null;
		this.winsCount = null;
		this._loggedIn = false;
	}

	/**
	 * Checks if user is logined or not.
	 * 
	 * @returns {boolean} True if user logined, false if he isn't.
	 */
	isLogged() {
		return this._loggedIn;
	}

	get nickname() {
		return this._nickname;
	}

	set nickname(nickname) {
		this._nickname = nickname;
	}

	get avatar() {
		return this._avatar;
	}

	set avatar(avatar) {
		this._avatar = avatar;
	}

	get defaultAvatar() {
		return this._avatar == null ? true : false;
	}

	get email() {
		return this._email;
	}

	set email(email) {
		this._email = email;
	}

	get rating() {
		return this._rating;
	}

	set rating(rating) {
		this._rating = rating;
	}

	get games() {
		return this._gamesCount;
	}

	set games(games) {
		this._gamesCount = games;
	}

	get wins() {
		return this._winsCount;
	}

	set wins(wins) {
		this._winsCount = wins;
	}

}

export default UserStorage;
