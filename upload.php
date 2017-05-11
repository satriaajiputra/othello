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

if(isset($GLOBALS['HTTP_RAW_POST_DATA'])) {
	$data['name'] = $init->upload($GLOBALS['HTTP_RAW_POST_DATA']);
}

echo json_encode($data);

