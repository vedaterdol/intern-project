import React from "react";
import "../FileUpload.css";
import { useDispatch, useSelector } from "react-redux";
import { setPdksXlsx, setPdksOutput } from "../redux/actions/pdksActions";
import { setGunSayisiXlsx, setGunSayisiOutput } from "../redux/actions/gunSayisiActions";
import { setPdksIstXlsx,setPdksIstOutput } from "../redux/actions/pdksIstActions";
import { useRef } from "react";
import { useNavigate } from 'react-router-dom';


function FileUpload() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const pdksXlsx = useSelector((state) => state.pdks.pdksXlsx);
  const gunSayisiXlsx = useSelector((state) => state.gunSayisi.gunSayisiXlsx);
  const pdksOutput = useSelector((state) => state.pdks.pdksOutput);
  const gunSayisiOutput = useSelector((state) => state.gunSayisi.gunSayisiOutput);
  const pdksIstXlsx = useSelector((state) => state.pdksIst.pdksIstXlsx);
  const pdksIstOutput = useSelector((state) => state.pdksIst.pdksIstOutput);



  const pdksInputRef = useRef(null);
  const gunSayisiInputRef = useRef(null);
  const pdksIstInputRef = useRef(null);
  


  const handlepdksXlsxChange = (event) => {
    dispatch(setPdksXlsx(event.target.files[0]));
  };

  const handlegunSayisiXlsxChange = (event) => {
    dispatch(setGunSayisiXlsx(event.target.files[0]));
  };

  const handlepdksIstXlsxChange = (event) => {
    dispatch(setPdksIstXlsx(event.target.files[0]));
  };

  const handleClearpdksXlsx = () => {
    if (pdksXlsx === null) {
      alert("You haven't uploaded any file yet!");
    }
    dispatch(setPdksXlsx(null));
    dispatch(setPdksOutput(null));
    pdksInputRef.current.value = "";
  };

  const handleCleargunSayisiXlsx = () => {
    if (gunSayisiXlsx === null) {
      alert("You haven't uploaded any file yet!");
    }
    dispatch(setGunSayisiXlsx(null));
    dispatch(setGunSayisiOutput(null));
    gunSayisiInputRef.current.value = "";
  };

  const handleClearpdksIstXlsx = () => {
    if (pdksIstXlsx === null) {
      alert("You haven't uploaded any file yet!");
    }
    dispatch(setPdksIstXlsx(null));
    dispatch(setPdksIstOutput(null));
    pdksInputRef.current.value = "";
  };

  const handleSubmitExcelFiles = async () => {
    if (!pdksXlsx && !gunSayisiXlsx) {
      alert("You haven't uploaded any file yet!");
      return;
    }
  
    const response = new FormData();
    const response2 = new FormData();
  
    if (pdksXlsx) {
      response.append("pdksXlsx", pdksXlsx);
    }
  
    if (gunSayisiXlsx) {
      response2.append("gunSayisiXlsx", gunSayisiXlsx);
    }
  
    try {
      const [pdksIstResponse, gunSayisiResponse] = await Promise.all([
        fetch("http://localhost:8040/api/upload-pdksXlsx", {
          method: "POST",
          body: response,
        }),
        fetch("http://localhost:8040/api/upload-gunSayisiXlsx", {
          method: "POST",
          body: response2,
        }),
      ]);
  
      if (pdksIstResponse.ok) {
        const pdksIstResult = await pdksIstResponse.json();
        dispatch(setPdksOutput(pdksIstResult.pdksOutput));
      } else {
        alert("Error occurred while uploading pdksXlsx file!");
        window.location.reload();
        dispatch(setPdksOutput("Error occurred during file upload."));
      }
  
      if (gunSayisiResponse.ok) {
        const gunSayisiResult = await gunSayisiResponse.json();
        dispatch(setGunSayisiOutput(gunSayisiResult.gunSayisiOutput));
      } else {
        alert("Error occurred while uploading gunSayisiXlsx file!");
        window.location.reload();
        dispatch(setGunSayisiOutput("Error occurred during file upload."));
      }
    } catch (error) {
      alert("Error occurred during file upload.");
      dispatch(setPdksOutput("Error occurred during file upload."));
      dispatch(setGunSayisiOutput("Error occurred during file upload."));
    }
  
    navigate("/excelComparison", { replace: true });
  };


  const handleSubmitExcelFilesIst = async () => {
    if (!pdksIstXlsx && !gunSayisiXlsx) {
      alert("You haven't uploaded any file yet!");
      return;
    }
  
    const response = new FormData();
    const response2 = new FormData();

  
    if (pdksIstXlsx) {
      response.append("pdksIstXlsx", pdksIstXlsx);
    }
  
    if (gunSayisiXlsx) {
      response2.append("gunSayisiXlsx", gunSayisiXlsx);
    }
  
    try {
      const [pdksIstResponse, gunSayisiResponse] = await Promise.all([
        fetch("http://localhost:8040/api/upload-pdksIstXlsx", {
          method: "POST",
          body: response,
        }),
        fetch("http://localhost:8040/api/upload-gunSayisiXlsx", {
          method: "POST",
          body: response2,
        }),
      ]);
  
      if (pdksIstResponse.ok) {
        const pdksIstResult = await pdksIstResponse.json();
        dispatch(setPdksIstOutput(pdksIstResult.pdksIstOutput));
      } else {
        alert("Error occurred while uploading pdksXlsx file!");
        window.location.reload();
        dispatch(setPdksIstOutput("Error occurred during file upload."));
      }
  
      if (gunSayisiResponse.ok) {
        const gunSayisiResult = await gunSayisiResponse.json();
        dispatch(setGunSayisiOutput(gunSayisiResult.gunSayisiOutput));
      } else {
        alert("Error occurred while uploading gunSayisiXlsx file!");
        window.location.reload();
        dispatch(setGunSayisiOutput("Error occurred during file upload."));
      }
    } catch (error) {
      alert("Error occurred during file upload.");
      dispatch(setPdksOutput("Error occurred during file upload."));
      dispatch(setGunSayisiOutput("Error occurred during file upload."));
    }
  
    navigate("/excelComparisonIst", { replace: true });
  };



  
  const handleSubmitpdksXlsx = async () => {
    if (!pdksXlsx) {
      alert("You haven't uploaded any file yet!");
      return;
    }

    const formData = new FormData();
    formData.append("pdksXlsx", pdksXlsx);

    try {
      const response = await fetch("http://localhost:8040/api/upload-pdksXlsx", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        dispatch(setPdksOutput(result.pdksOutput));
        navigate('/pdksOutput', { replace: true })        


      } else {
        alert("You tried to upload incorrect file!");
        dispatch(setPdksOutput("Error occurred during file upload."));
      }
    } catch (error) {
      dispatch(setPdksOutput("Error occurred during file upload."));
    }
  };


  const handleSubmitgunSayisiXlsx = async () => {
    if (!gunSayisiXlsx) {
      alert("You haven't uploaded any file yet!");
      return;
    }
    

    const formData = new FormData();
    formData.append("gunSayisiXlsx", gunSayisiXlsx);

    try {
      const response = await fetch("http://localhost:8040/api/upload-gunSayisiXlsx", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        dispatch(setGunSayisiOutput(result.gunSayisiOutput));
        navigate('/gunSayisiOutput', { replace: true })        

      } else {
        alert("You tried to upload incorrect file!");
        dispatch(setGunSayisiOutput("Error occurred during file upload."));
      }
    } catch (error) {
      dispatch(setGunSayisiOutput("Error occurred during file upload."));
    }
  };

  const handleSubmitpdksIstXlsx = async () => {
    if (!pdksIstXlsx) {
      alert("You haven't uploaded any file yet!");
      return;
    }

    const formData = new FormData();
    formData.append("pdksIstXlsx", pdksIstXlsx);

    try {
      const response = await fetch("http://localhost:8040/api/upload-pdksIstXlsx", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        dispatch(setPdksIstOutput(result.pdksIstOutput));
        navigate('/pdksIstOutput', { replace: true })        


      } else {
        alert("You tried to upload incorrect file!");
        dispatch(setPdksIstOutput("Error occurred during file upload."));
      }
    } catch (error) {
      dispatch(setPdksIstOutput("Error occurred during file upload."));
    }
  };

  return (
    <div>
      <div>
      <table>
          <tbody>
            <tr>
              <td>
                <h3>PDKS.xlsx Kontrol İzmir</h3>
              </td>
              <td>
                {pdksXlsx ? (
                  <div>
                    <input
                      type="file"
                      onChange={handlepdksXlsxChange}
                      style={{ display: "none" }}
                      ref={pdksInputRef}
                    />
                    <span>{pdksXlsx.name}</span>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      onChange={handlepdksXlsxChange}
                      ref={pdksInputRef}
                    />
                  </div>
                )}

              </td>
              <td>
                <button onClick={handleSubmitpdksXlsx}>Kontrol Et</button>
                <button onClick={handleClearpdksXlsx}>Temizle</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
      <table>
          <tbody>
            <tr>
              <td>
                <h3>PDKS.xlsx Kontrol İstanbul</h3>
              </td>
              <td>
                {pdksIstXlsx ? (
                  <div>
                    <input
                      type="file"
                      onChange={handlepdksIstXlsxChange}
                      style={{ display: "none" }}
                      ref={pdksIstInputRef}
                    />
                    <span>{pdksIstXlsx.name}</span>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      onChange={handlepdksIstXlsxChange}
                      ref={pdksIstInputRef}
                    />
                  </div>
                )}

              </td>
              <td>
                <button onClick={handleSubmitpdksIstXlsx}>Kontrol Et</button>
                <button onClick={handleClearpdksIstXlsx}>Temizle</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      

      <div>
      <table>
          <tbody>
            <tr>
              <td>
                <h3>Arge Gün Sayısı</h3>
              </td>
              <td>
                {gunSayisiXlsx ? (
                  <div>
                    <input
                      type="file"
                      onChange={handlegunSayisiXlsxChange}
                      style={{ display: "none" }}
                      ref={gunSayisiInputRef}
                    />
                    <span>{gunSayisiXlsx.name}</span>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      onChange={handlegunSayisiXlsxChange}
                      ref={gunSayisiInputRef}
                    />
                  </div>
                )}

              </td>
              <td>
                <button onClick={handleSubmitgunSayisiXlsx}>Kontrol Et</button>
                <button onClick={handleCleargunSayisiXlsx}>Temizle</button>

              </td>
            </tr>
          </tbody>
        </table>
      </div>

        
       
     <div>
  <table>
          <tbody>
            <tr>
              <td>
                <h3>2 Excel Karşılaştırma İzmir</h3>
              </td>
              <td>
                {pdksXlsx && gunSayisiXlsx ? (
                  <div>
                    <input
                      type="file"
                      onChange={handlepdksXlsxChange}
                      style={{ display: "none" }}
                      ref={pdksInputRef}
                    />
                    <span>{pdksXlsx.name}</span>
                    <input
                      type="file"
                      onChange={handlegunSayisiXlsxChange}
                      style={{ display: "none" }}
                      ref={gunSayisiInputRef}
                    />
                    <span>{gunSayisiXlsx.name}</span>
                  </div>
                  
                ) : (
                  <div>
                    <label htmlFor="">PDKS.xlsx</label>
                    <input
                      type="file"
                      onChange={handlepdksXlsxChange}
                      ref={pdksInputRef}
                    />
                    <label htmlFor="">Arge Gün Sayısı</label>

                     <input
                      type="file"
                      onChange={handlegunSayisiXlsxChange}
                      ref={gunSayisiInputRef}
                    />
                  </div>
                )}

              </td>
              <td>
                <button onClick={handleSubmitExcelFiles}>Kontrol Et</button>
                <button onClick={handleCleargunSayisiXlsx}>Temizle</button>

              </td>
            </tr>
          </tbody>
        </table>
     </div>

     

      <div>
  <table>
          <tbody>
            <tr>
              <td>
                <h3>2 Excel Karşılaştırma İstanbul</h3>
              </td>
              <td>
                {pdksIstXlsx && gunSayisiXlsx ? (
                  <div>
                    <input
                      type="file"
                      onChange={handlepdksIstXlsxChange}
                      style={{ display: "none" }}
                      ref={pdksIstInputRef}
                    />
                    <span>{pdksIstXlsx.name}</span>
                    <input
                      type="file"
                      onChange={handlegunSayisiXlsxChange}
                      style={{ display: "none" }}
                      ref={gunSayisiInputRef}
                    />
                    <span>{gunSayisiXlsx.name}</span>
                  </div>
                  
                ) : (
                  <div>
                    <label htmlFor="">PDKS.xlsx</label>
                    <input
                      type="file"
                      onChange={handlepdksIstXlsxChange}
                      ref={pdksIstInputRef}
                    />
                    <label htmlFor="">Arge Gün Sayısı</label>

                     <input
                      type="file"
                      onChange={handlegunSayisiXlsxChange}
                      ref={gunSayisiInputRef}
                    />
                  </div>
                )}

              </td>
              <td>
                <button onClick={handleSubmitExcelFilesIst}>Kontrol Et</button>
                <button onClick={handleCleargunSayisiXlsx}>Temizle</button>

              </td>
            </tr>
          </tbody>
        </table>
     </div>

     
        
    </div>
  );
}

export default FileUpload;