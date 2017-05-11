<?php

date_default_timezone_set("Asia/Jakarta");

class GameOthello
{
	private $host = 'localhost',
			$user = 'root',
			$pass = '',
			$dbn  = 'othello';

	protected $db;

	public function __construct()
	{
		try {
			$this->db = new PDO("mysql:host=$this->host;dbname=$this->dbn", $this->user, $this->pass);
		} catch (PDOException $e) {
			die("ERROR: ".$e->getMessage());
		}
	}

	public function saveImage($name)
	{
		$query = $this->db->prepare("INSERT INTO user (photo) VALUES (?)");
		$query->bindParam(1, $name);
		$result = $query->execute();
		return $this->selectResult('user', $this->db->lastInsertId());
	}

	public function selectResult($table, $id)
	{
		$query = $this->db->prepare("SELECT * FROM $table WHERE id = ?");
		$query->bindValue(1, $id);
		$query->execute();
		return $query->fetch(PDO::FETCH_OBJ);
	}

	public function upload($file)
	{
		$image = $file;
		$decoded = base64_decode($image);
		$fileName = 'images/'.time().'.png';

		$data = fopen($fileName, 'wb');
		fwrite($data, $decoded);
		fclose($data);
		return $this->saveImage($fileName);
	}

	public function checkCoordinate($id, $x, $y)
	{
		$query = $this->db->prepare("SELECT id FROM coordinates WHERE x = ? AND y = ? AND user_id = ?");
		$query->bindParam(1, $x);
		$query->bindParam(2, $y);
		$query->bindParam(3, $id);
		$query->execute();

		return $query->rowCount();
	}

	public function saveCoordinate($id, $x, $y, $color)
	{		
		if($this->checkCoordinate($id, $x ,$y) > 0) {
			$query = $this->db->prepare("UPDATE coordinates SET color = ? WHERE x = ? AND y = ? AND user_id = ?");
			$query->bindParam(1, $color);
			$query->bindParam(2, $x);
			$query->bindParam(3, $y);
			$query->bindParam(4, $id);
		} else {
			$query = $this->db->prepare("INSERT INTO coordinates (x, y, user_id, color) VALUES (?, ?, ?, ?)");
			$query->bindParam(1, $x);
			$query->bindParam(2, $y);
			$query->bindParam(3, $id);
			$query->bindParam(4, $color);
		}
		
		
		$query->execute();
		
		return true;
	}

	public function getCoordinate($id)
	{
		$query = $this->db->prepare("SELECT * FROM coordinates WHERE user_id = ?");
		$query->bindValue(1, $id);
		$query->execute();
		return $query->fetchAll(PDO::FETCH_OBJ);
	}

	public function deleteCoordinate($id)
	{
		$query = $this->db->prepare("DELETE FROM coordinates WHERE user_id = ?");
		$query->bindValue(1, $id);
		$query->execute();
	}

	public function savePlayer($id, $name, $score)
	{
		$query = $this->db->prepare("UPDATE user SET name = ?, score = ?, finish_at = ? WHERE id = ?");
		$query->bindParam(1, $name);
		$query->bindParam(2, $score);
		$query->bindParam(3, date("Y-m-d H:i:s"));
		$query->bindParam(4, $id);
		$query->execute();
	}

	public function getHighScore()
	{
		$query = $this->db->prepare("SELECT name, score, photo, TIMESTAMPDIFF(SECOND, start_at, finish_at) AS waktu FROM user WHERE score != 0 ORDER BY score DESC, waktu ASC LIMIT 5");
		$query->execute();
		return $query->fetchAll(PDO::FETCH_OBJ);
	}
}

$init = new GameOthello();
$method = $_SERVER['REQUEST_METHOD'];
$data = [];
$mode = $_GET['mode'];

if(isset($mode)) {
	switch ($mode) {
		case 'upload':
			$foto = file_get_contents("php://input");
			if(isset($foto)) {
				$data['data'] = $init->upload($foto);
			}
			break;
		
		case 'coordinate':
			$init->saveCoordinate($_GET['id'], $_GET['x'], $_GET['y'], $_GET['color']);
			break;

		case 'getcoordinate':
				$data['data'] = $init->getCoordinate($_GET['id']);
			break;

		case 'delete':
				$init->deleteCoordinate($_GET['id']);
			break;

		case 'highscore':
				$data['data'] = $init->getHighScore();
			break;
		default:
			# code...
			break;
	}
}


if($mode == "save" && $method == "POST") {
	$input = $_POST;
	$init->savePlayer($input['id'], $input['name'], $input['score']);
}

echo json_encode($data);

