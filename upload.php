<?php

class GameOthello
{
	public function upload($file)
	{
		$image = $file;
		$decoded = base64_decode($image);
		$fileName = 'images/'.time().'.png';

		$data = fopen($fileName, 'wb');
		fwrite($data, $decoded);
		fclose($data);
		return $fileName;
	}
}

$init = new GameOthello();
$foto = file_get_contents("php://input");
if(isset($foto)) {
	$data['name'] = $init->upload($foto);
}

echo json_encode($data);

